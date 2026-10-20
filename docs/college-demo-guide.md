# ChargeSlot — Complete College Demonstration Guide ⚡
**EV Charging Station Booking System | Project Presentation Script**

This guide provides the exact demonstration flow for presenting ChargeSlot to your college faculty, external examiners, and project evaluators.

---

## 🎯 1. Presentation Outline & Objectives
- **Project Problem:** EV drivers face queue delays and unpredictable charger availability.
- **Solution:** A cloud-native, overlap-proof booking system with separate customer & operator dashboards.
- **Key Technical Requirements Satisfied:**
  1. Full-Stack Web Development (React + Express)
  2. Database CRUD & Mongoose Aggregations (MongoDB)
  3. Strict Concurrency & Overlap Prevention Logic
  4. Docker Containerization & Compose Multi-Service Architecture
  5. Kubernetes Orchestration, Persistent Volumes & Horizontal Scaling

---

## ⚡ 2. Live Demo Script (Step-by-Step)

### Step 1: 1-Click Authentication & Role Demonstration
1. Open the application at `http://localhost:5173` (or `http://localhost:3000`).
2. Show the **Landing Page** with live metrics dynamically loaded from MongoDB:
   - Notice the count of active stations and real-time available connectors.
3. Click **Sign In**.
4. Use the **1-Click Demo Login** buttons:
   - Click **👤 Customer (Raj)** to log in as Raj Amrutiya (`raj@chargeslot.com`).
   - Show the **Customer Dashboard**:
     - 4 Stat cards (Total, Upcoming, Completed, Cancelled).
     - Confirmed upcoming reservation banner with booking code.
     - Nearby stations and recent booking history.

---

### Step 2: Customer Station Search & Interactive Map
1. Navigate to **Find Stations** (`/stations`).
2. Point out:
   - Leaflet OpenStreetMap with custom EV charger map pins.
   - Click a station pin on the map to show the interactive popup with pricing and availability.
   - Filter by connector type (select `CCS2` to see DC fast charging hubs).
   - Filter by price (select `Under ₹18 / kWh`).
3. Click **View & Book** on **Central EV Charging Hub**.

---

### Step 3: Real-Time Availability & Slot Checkout
1. On the **Station Details Page**:
   - Inspect the station operating hours, pricing, amenities, and list of connectors.
   - Point to the **Available Slots Grid**: slots are dynamically generated for each hour.
2. Select an available slot (e.g., 14:00 - 15:00) and click **Book Selected Slot**.
3. In the **Checkout Page**:
   - Review pre-filled vehicle details from Raj's profile.
   - Review the estimated cost calculation (Rate * Duration * estimated power).
   - Click **Confirm & Reserve Slot**.
4. Show the generated **Digital Voucher / Ticket** with:
   - Unique reference code (e.g. `CS-2026-X8K9`).
   - Customer and vehicle info.
   - Barcode strip and **Print Voucher** button.

---

### Step 4: Overlapping Reservation Conflict Prevention (CRITICAL DEMO)
*This proves your business logic and concurrency validation to the examiners.*

1. Open an Incognito / Second browser window.
2. Navigate to `http://localhost:5173/login` and log in as Priya (`priya@chargeslot.com`).
3. Attempt to book the **exact same connector** at the **same time slot** (or overlapping, e.g. 14:30 - 15:30).
4. Click **Confirm & Reserve Slot**.
5. **Show the Result:**
   - The server instantly rejects the reservation with:
     > **"Reservation Conflict: This specific connector slot was just booked by another driver or overlaps with an existing reservation."** (HTTP 409 Conflict).
   - Explain the backend formula:
     $$\text{existing.startTime} < \text{requested.endTime} \quad \land \quad \text{existing.endTime} > \text{requested.startTime}$$

---

### Step 5: Cancellation & Slot Release
1. In Raj's portal, go to **My Bookings** (`/bookings`).
2. Click **Cancel** on the booking created in Step 3.
3. Confirm cancellation in the modal dialog.
4. Show that the booking status changes to `Cancelled`.
5. Return to Priya's window, click **Confirm & Reserve Slot** again:
   - It now **succeeds immediately** because the slot was atomically released!

---

### Step 6: Administrator CRUD Operations
1. Switch to the **Admin Portal** by clicking **Demo Admin** or logging in as `admin@chargeslot.com`.
2. Inspect the **Admin Dashboard**:
   - Total stations, active connectors, total bookings, estimated platform value.
   - **Recharts Analytics:** 7-Day Reservation Trend area chart & Status Distribution donut chart.
3. Demonstrate **Station CRUD** (`/admin/stations`):
   - Click **Add New Station**. Fill in name "GIDC Supercharger", rate ₹19/kWh. Click **Create Station**.
   - Show the newly created station document in the table.
   - Click **Edit** to modify operating hours or price.
   - Show the **Archive / Delete** button with safe foreign key checking.
4. Demonstrate **Connector Management** (`/admin/connectors`):
   - Add a 120kW CCS2 connector to the new station.
5. Demonstrate **User Management** (`/admin/users`):
   - View customer list, toggle active/inactive account status.

---

### Step 7: Docker & Containerization Demonstration
In the terminal, show your running containers:

```bash
docker compose up -d
docker compose ps
```
Explain:
- `chargeslot-frontend`: React client served by Nginx Alpine.
- `chargeslot-backend`: Node.js Express REST API connected via internal Docker network.
- `chargeslot-mongo`: Official MongoDB 7.0 container with persistent named volume `mongo-data`.

---

### Step 8: Kubernetes Orchestration & Horizontal Pod Scaling
Show the Kubernetes manifests in `k8s/` and demonstrate live pod scaling in Minikube:

```bash
# Apply manifests
kubectl apply -f k8s/

# View running pods and services
kubectl get pods -n chargeslot
kubectl get services -n chargeslot

# Demonstrate Horizontal Scaling on the Backend API Pods!
kubectl scale deployment backend-deployment --replicas=4 -n chargeslot

# Verify scaling in real-time
kubectl get pods -n chargeslot -w
```
Explain:
- Kubernetes dynamically provisions 4 backend API pods behind the `backend-service` ClusterIP load balancer.
- Persistent volume claim `mongo-pvc` guarantees that database records survive even if all database pods restart.
