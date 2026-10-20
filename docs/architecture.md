# ChargeSlot — System Architecture & Concurrency Blueprint ⚡

ChargeSlot is a cloud-native Electric Vehicle (EV) Charging Station Reservation Platform engineered with a React.js client, an Express.js REST API service, and a MongoDB persistence tier, packaged in Docker containers and orchestrated with Kubernetes.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    Client["Client Web Browser (Desktop / Mobile)"]

    subgraph "Ingress / Reverse Proxy"
        Nginx["Nginx Reverse Proxy & Static Asset Server (Port 80/3000)"]
    end

    subgraph "Application Layer"
        Backend1["Express.js API Pod 1 (Port 5000)"]
        Backend2["Express.js API Pod 2 (Port 5000)"]
        BackendN["Express.js API Pod N (Auto-scaled)"]
    end

    subgraph "Persistence Layer"
        Mongo[("MongoDB Replica / Pod\n(Port 27017)\nchargeslot db")]
        Volume[("PersistentVolumeClaim\n(mongo-pvc 2Gi)")]
    end

    Client -->|HTTP / SPA Navigation| Nginx
    Nginx -->|/api/* Reverse Proxy| Backend1
    Nginx -->|/api/* Reverse Proxy| Backend2
    Nginx -->|/api/* Load Balanced| BackendN
    Backend1 -->|Mongoose Connection Pool| Mongo
    Backend2 -->|Mongoose Connection Pool| Mongo
    BackendN -->|Mongoose Connection Pool| Mongo
    Mongo --- Volume
```

---

## 2. Database Schema & Entity Relationships

The data model is deliberately normalized across four primary collections to avoid unbounded array growth while maintaining relational integrity.

```mermaid
erDiagram
    USER ||--o{ BOOKING : "places (1:N)"
    USER ||--o{ NOTIFICATION : "receives (1:N)"
    STATION ||--|{ CONNECTOR : "houses (1:N)"
    STATION ||--o{ BOOKING : "hosted at (1:N)"
    CONNECTOR ||--o{ BOOKING : "reserved by (1:N)"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string passwordHash
        string phone
        string role "customer | admin"
        string status "active | inactive"
        object preferredVehicle
        date createdAt
        date updatedAt
    }

    STATION {
        ObjectId _id PK
        string name
        string address
        string city
        string postalCode
        GeoJSON location "Point [lng, lat]"
        string imageUrl
        string openingTime "HH:mm"
        string closingTime "HH:mm"
        number pricePerKwh
        array amenities
        string status "active | inactive"
    }

    CONNECTOR {
        ObjectId _id PK
        ObjectId stationId FK
        string label "CCS2-01"
        string type "CCS2 | Type 2 | CHAdeMO"
        number powerKw
        string status "available | maintenance | offline"
    }

    BOOKING {
        ObjectId _id PK
        string bookingCode UK "CS-2026-XXXX"
        ObjectId userId FK
        ObjectId stationId FK
        ObjectId connectorId FK
        date startTime
        date endTime
        string status "confirmed | cancelled | completed | no_show"
        number estimatedCost
        string notes
        object vehicleInfo
    }
```

---

## 3. Atomic Overlapping Booking Conflict Prevention

### The Mathematical Overlap Condition

To ensure that two reservations never collide on the exact same physical connector, an overlap occurs if and only if:

$$\text{existing.startTime} < \text{requested.endTime} \quad \land \quad \text{existing.endTime} > \text{requested.startTime}$$

### Edge Case Matrix: Adjacent Slots vs Overlapping Slots

| Case | Existing Slot | Requested Slot | Overlap? | Action |
|---|---|---|---|---|
| **Case A (Disjoint Past)** | 10:00 - 11:00 | 12:00 - 13:00 | **No** (11:00 $\le$ 12:00) | **Accepted** |
| **Case B (Adjacent Preceding)** | 10:00 - 11:00 | 11:00 - 12:00 | **No** (11:00 < 11:00 is False) | **Accepted** |
| **Case C (Partial Overlap)** | 10:00 - 11:00 | 10:30 - 11:30 | **Yes** (10:00 < 11:30 and 11:00 > 10:30) | **Rejected (409 Conflict)** |
| **Case D (Complete Enclosure)** | 10:00 - 12:00 | 10:30 - 11:30 | **Yes** (10:00 < 11:30 and 12:00 > 10:30) | **Rejected (409 Conflict)** |
| **Case E (Enclosing Requested)** | 10:30 - 11:00 | 10:00 - 12:00 | **Yes** (10:30 < 12:00 and 11:00 > 10:00) | **Rejected (409 Conflict)** |

### Compound Indexes for Instant Query Execution

MongoDB utilizes a compound index on the `bookings` collection:
```javascript
bookingSchema.index({ connectorId: 1, status: 1, startTime: 1, endTime: 1 });
```
This guarantees sub-millisecond execution times even with hundreds of thousands of historical records.
