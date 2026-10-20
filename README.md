# ChargeSlot — EV Charging Station Booking System ⚡

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-24+-2496ed.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28+-326ce5.svg)](https://kubernetes.io/)

**ChargeSlot** is a full-stack, cloud-native Electric Vehicle (EV) Charging Station Reservation Platform engineered for university examination and technical demonstrations. It features a responsive React.js frontend, an Express.js REST API with atomic concurrency control, a MongoDB database, Docker containerization, and Kubernetes cluster orchestration with horizontal pod autoscaling.

---

## 🚀 Key Features

### 👤 Customer Portal
- **Interactive Station Directory:** Interactive OpenStreetMap integration with React Leaflet and custom EV charger map pins.
- **Dynamic Slot Availability:** 1-hour time slots computed dynamically against live station operating hours.
- **Overlap-Proof Booking Engine:** Prevents duplicate or overlapping reservations for the same physical connector using atomic isolation:
  $$\text{existing.startTime} < \text{requested.endTime} \quad \land \quad \text{existing.endTime} > \text{requested.startTime}$$
- **Digital Booking Pass:** Voucher ticket format with unique reference code, timing, and printable receipt.
- **Instant Cancellation & Release:** Released slots immediately become available for other drivers.

### 🛡️ Station Administrator Portal
- **Real-Time Analytics Dashboard:** Metric overview and Recharts data visualizations (7-Day trends & status distribution).
- **Charging Station CRUD:** Create, edit, and safely archive stations with GPS coordinates and amenities.
- **Connector Management:** Add and configure CCS2, Type 2, and CHAdeMO connectors with power ratings and status toggles.
- **Reservations & User Audit:** Search all platform bookings, override cancel slots, and manage customer account permissions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router 6, Axios, Lucide React, Recharts, React Leaflet |
| **Backend** | Node.js, Express.js, Mongoose 8, Zod Validation, bcryptjs, JWT, Helmet, CORS, Morgan |
| **Database** | MongoDB 7.0 with GeoJSON 2dsphere indexing and compound reservation indexes |
| **Containers** | Docker, Multi-Stage Dockerfiles (Nginx Alpine + Node Alpine), Docker Compose |
| **Orchestration** | Kubernetes (Minikube), Deployments, Services, ConfigMaps, Secrets, PVCs |

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- Node.js v18+ & npm
- MongoDB running locally on port `27017` (e.g. `brew services start mongodb-community@7.0`)

### 2. Backend Setup
```bash
cd backend
npm install

# Seed the database with demo stations, connectors, and accounts:
npm run seed

# Run automated tests verifying auth, CRUD, and overlap prevention:
npm test

# Start Express server (runs on http://localhost:5000):
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start Vite dev server (runs on http://localhost:5173):
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Demo Login Credentials

The application includes **1-Click Demo Login** buttons on the login screen for instant evaluation:

| Role | Email | Password | Pre-configured Data |
|---|---|---|---|
| **Customer (Raj)** | `raj@chargeslot.com` | `Customer@123` | Active Tata Nexon EV booking tomorrow at 10 AM |
| **Customer (Priya)** | `priya@chargeslot.com` | `Customer@123` | Active MG ZS EV booking |
| **Admin Operator** | `admin@chargeslot.com` | `Admin@123` | Full administrative and CRUD permissions |

---

## 🐳 Docker Deployment

Run the complete multi-tier system with persistent storage using a single command:

```bash
docker compose up --build -d
```

Verify running containers:
```bash
docker compose ps
```

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000/api`
- **MongoDB:** `localhost:27017`

---

## ☸️ Kubernetes Deployment (Minikube)

```bash
# 1. Start Minikube
minikube start

# 2. Deploy all manifests
kubectl apply -f k8s/

# 3. Check deployment status
kubectl get pods -n chargeslot
kubectl get services -n chargeslot

# 4. Demonstrate Horizontal Scaling on the Backend API!
kubectl scale deployment backend-deployment --replicas=3 -n chargeslot

# 5. Access frontend via Minikube
minikube service frontend-service -n chargeslot
```

---

## 📁 Repository Structure

```
chargeslot-ev-booking/
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/           # MongoDB connection
│   │   ├── models/           # Mongoose schemas (User, Station, Connector, Booking)
│   │   ├── controllers/      # REST API route controllers
│   │   ├── services/         # Booking logic & overlap algorithm
│   │   ├── middleware/       # Auth, RBAC, Zod validation, error handler
│   │   ├── validators/       # Zod schemas
│   │   ├── routes/           # Express router endpoints
│   │   ├── seed.js           # Database seeder
│   │   └── server.js         # Entry point
│   ├── tests/                # Automated API test runner
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # React.js + Vite Client
│   ├── src/
│   │   ├── components/       # Layout, Map, Modals, Badges
│   │   ├── context/          # Auth Context & session management
│   │   ├── pages/            # All 16 Customer & Admin pages
│   │   ├── services/         # Axios API client
│   │   └── App.jsx
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── mongo-pvc.yaml
│   ├── mongo-service.yaml
│   ├── mongo-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── ingress.yaml
├── docs/                     # University Documentation
│   ├── architecture.md       # Architecture & overlap proof
│   ├── api-documentation.md  # Complete REST API reference
│   └── college-demo-guide.md # Faculty presentation script
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📖 University Submission Checklist
- [x] Responsive React frontend with modern eco-tech design system
- [x] Node.js + Express REST API architecture
- [x] MongoDB database with Mongoose schemas and compound indexes
- [x] Full CRUD operations for Stations, Connectors, Bookings, and Users
- [x] Overlapping reservation conflict prevention with mathematical isolation
- [x] Multi-stage Dockerfiles and Docker Compose configuration
- [x] Kubernetes manifests with Persistent Volumes, Secrets, and Pod Scaling
- [x] Git version control with clean commit history
- [x] Comprehensive architectural and API documentation

Developed by **Raj Amrutiya** for the University Mini Project Examination (2026).
