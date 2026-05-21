# BusBeacon

BusBeacon is a full-stack school transportation management platform focused on real-time bus tracking, secure attendance verification, and communication between schools, parents, and students.

The system enables schools to monitor buses live, allows parents and students to track routes in real time, and prevents fake attendance through QR-based validation combined with live GPS and geofencing.

---

## Overview

Traditional school transport systems often lack:
- Real-time visibility of buses
- Reliable attendance verification
- Efficient communication during trips
- Centralized transport management

BusBeacon solves these problems by providing a centralized platform for administrators, drivers, conductors, parents, and students.

---

# Core Features

## Real-Time Bus Tracking
- Live GPS tracking for school buses
- Real-time location updates using Socket.IO
- Interactive route visualization using OpenStreetMap
- ETA estimation for parents and students
- Route stop monitoring

## Secure Attendance Verification
Attendance cannot be marked manually by students.

The system validates attendance through:
- QR code scanning
- Active trip verification
- Live GPS validation
- Route matching
- Stop assignment checks
- Geofence proximity validation

## Role-Based Dashboards

### Admin
- Manage buses, routes, stops, and users
- Monitor active trips
- Track live bus locations
- View attendance records and reports

### Driver
- Start and end trips
- Share continuous live location

### Conductor
- Scan student QR codes
- Mark verified attendance

### Parent & Student
- Track assigned bus in real time
- View route information and ETA
- Receive trip notifications

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Leaflet.js
- Socket.IO Client

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## Services
- Firebase Cloud Messaging
- OpenStreetMap API
- Browser Geolocation API

---

# System Architecture

```text
BusBeacon
│
├── frontend
│   ├── Authentication
│   ├── Dashboards
│   ├── Maps & Tracking
│   ├── Attendance UI
│   └── Notifications
│
├── backend
│   ├── REST APIs
│   ├── Authentication
│   ├── Attendance Engine
│   ├── Trip Management
│   ├── Socket.IO Services
│   └── Notification Services
│
└── database
    └── MongoDB
```

---

# Project Structure

```bash
BusBeacon/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── seed/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── pages/
│   └── public/
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/busbeacon.git
cd busbeacon
```

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

## Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

# Running the Application

## Seed Database

```bash
npm run seed
```

## Start Development Server

```bash
npm run dev
```

Frontend:
```bash
http://localhost:5173
```

Backend:
```bash
http://localhost:5000
```

---

# Demo Credentials

| Role | Email |
|------|------|
| Admin | admin@busbeacon.test |
| Driver | driver@busbeacon.test |
| Conductor | conductor@busbeacon.test |
| Parent | parent@busbeacon.test |
| Student | student@busbeacon.test |

Password:

```bash
Password123!
```

---

# API Modules

## Authentication
```http
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
```

## Trips
```http
GET  /api/trips
POST /api/trips/start
POST /api/trips/:id/end
```

## Attendance
```http
GET  /api/attendance
POST /api/attendance/scan
```

## Notifications
```http
GET   /api/notifications
POST  /api/notifications/emergency
PATCH /api/notifications/:id/read
```

---

# Attendance Validation Workflow

1. Driver starts trip
2. Bus begins live GPS sharing
3. Conductor scans student QR code
4. Backend validates:
   - Active trip
   - GPS availability
   - Assigned route
   - Assigned stop
   - Geofence proximity
5. Attendance is recorded securely

---

# Deployment

## Frontend
- Vercel
- Netlify

## Backend
- Render
- Railway

## Database
- MongoDB Atlas

---

# Future Improvements

- AI-based ETA prediction
- Multi-school support
- Offline attendance synchronization
- Face recognition attendance
- SMS and WhatsApp alerts
- Driver analytics dashboard

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to your branch
5. Open a Pull Request

---

# License

This project is licensed under the MIT License.
