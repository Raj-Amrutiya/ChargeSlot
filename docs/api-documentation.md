# ChargeSlot REST API Documentation ⚡

All REST API endpoints are prefixed with `/api` and exchange payload structures formatted in JSON.

---

## 1. Authentication Endpoints

### Register Customer
- **Method:** `POST`
- **Route:** `/api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "Raj Amrutiya",
  "email": "raj@chargeslot.com",
  "password": "Customer@123",
  "phone": "+91 98250 12345",
  "preferredVehicle": {
    "model": "Tata Nexon EV Max",
    "regNumber": "GJ-01-EV-2026"
  }
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "data": {
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Raj Amrutiya",
      "email": "raj@chargeslot.com",
      "role": "customer"
    }
  }
}
```

### Sign In
- **Method:** `POST`
- **Route:** `/api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "raj@chargeslot.com",
  "password": "Customer@123"
}
```
- **Response (200 OK):** Sets HTTP-only cookie `token` and returns user metadata.

### Current Session User
- **Method:** `GET`
- **Route:** `/api/auth/me`
- **Access:** Private (Cookie or `Authorization: Bearer <token>`)

---

## 2. Charging Stations Endpoints

### List / Search Stations
- **Method:** `GET`
- **Route:** `/api/stations`
- **Query Parameters:**
  - `search` (string): Search by name, address or city
  - `city` (string): Filter by city
  - `connectorType` (string): `CCS2`, `Type 2`, `CHAdeMO`
  - `maxPrice` (number): Price threshold
  - `status` (string): `active` (default) or `inactive`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6ad6ccdde2e25c9cf00c8c3e",
      "name": "Central EV Charging Hub",
      "address": "Opposite Vastrapur Lake, Vastrapur",
      "city": "Ahmedabad",
      "pricePerKwh": 18,
      "totalConnectors": 3,
      "availableConnectors": 3,
      "connectorTypes": ["CCS2", "Type 2"],
      "maxPowerKw": 120
    }
  ]
}
```

### Station Availability Slots
- **Method:** `GET`
- **Route:** `/api/stations/:id/availability?date=YYYY-MM-DD`
- **Response (200 OK):**
Returns 1-hour time intervals from station opening to closing time, with `isAvailable` boolean, `availableCount`, and list of available connector objects.

### Create Station (Admin Only)
- **Method:** `POST`
- **Route:** `/api/stations`
- **Access:** Private / Admin
- **Request Body:**
```json
{
  "name": "Vastrapur Supercharge Plaza",
  "address": "Near AlphaOne Mall",
  "city": "Ahmedabad",
  "postalCode": "380015",
  "latitude": 23.0373,
  "longitude": 72.5293,
  "pricePerKwh": 18,
  "openingTime": "06:00",
  "closingTime": "23:00",
  "amenities": ["Café", "Restroom", "Wi-Fi"]
}
```

---

## 3. Booking Endpoints

### Create Reservation
- **Method:** `POST`
- **Route:** `/api/bookings`
- **Access:** Private
- **Request Body:**
```json
{
  "stationId": "6ad6ccdde2e25c9cf00c8c3e",
  "connectorId": "6ad6ccdde2e25c9cf00c8c45",
  "startTime": "2026-10-25T10:00:00.000Z",
  "endTime": "2026-10-25T11:00:00.000Z",
  "notes": "Morning highway top-up"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Booking confirmed successfully!",
  "data": {
    "_id": "6ad6ccf971e03526cdb85c76",
    "bookingCode": "CS-2026-X8K9",
    "status": "confirmed",
    "estimatedCost": 288
  }
}
```
- **Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Selected slot is no longer available. Please choose another time or connector."
}
```

### Cancel Reservation
- **Method:** `PATCH`
- **Route:** `/api/bookings/:id/cancel`
- **Access:** Private (Owner or Admin)
- **Response (200 OK):** Sets status to `cancelled` and frees the connector slot.

---

## 4. Admin Management Endpoints

- `GET /api/admin/dashboard` - Platform statistics, counts, recent reservations
- `GET /api/admin/analytics` - 7-day booking trends, status distribution, top stations
- `GET /api/admin/bookings` - All reservations with filtering & search
- `GET /api/admin/users` - All customer & operator accounts
- `PATCH /api/admin/users/:id` - Toggle account status (`active` / `inactive`) or role
