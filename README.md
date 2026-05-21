# BusBeacon

BusBeacon is a full-stack school bus tracking and attendance management system designed to improve student safety, ensure attendance authenticity, and provide real-time communication between schools, parents, drivers, and students.

The platform provides live GPS tracking, QR-based attendance verification, route monitoring, emergency alerts, and dedicated dashboards for administrators, drivers, conductors, parents, and students.

---

## Features

### Authentication and Authorization
- JWT-based authentication
- Role-based access control
- Secure password hashing using bcrypt

### Real-Time Bus Tracking
- Live GPS tracking using Socket.IO
- Interactive maps powered by OpenStreetMap and Leaflet.js
- Real-time ETA updates
- Route visualization with stop markers

### Secure Attendance Management
- QR-code-based attendance verification
- Attendance can only be marked by conductors or administrators
- Active trip validation
- Live GPS verification
- Geofence-based attendance validation
- Route and stop verification

### User Dashboards
- Admin Dashboard
- Driver Dashboard
- Conductor Dashboard
- Parent Dashboard
- Student Dashboard

### Notifications and Emergency Support
- Emergency SOS events
- Push notifications using Firebase Cloud Messaging
- Attendance and trip notifications

### Progressive Web Application
- Responsive mobile-first interface
- Dark mode support
- Installable PWA support

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

## Services and APIs
- Firebase Cloud Messaging
- OpenStreetMap
- Browser Geolocation API

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
└── .github/
```

---

# Getting Started

## Prerequisites

Ensure the following are installed on your system:

- Node.js 20+
- npm
- MongoDB Atlas or Local MongoDB

---

# Installation

Clone the repository:

```bash
git clone https://github.com/your-username/busbeacon.git
cd busbeacon
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

## Backend Environment Variables (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/busbeacon
JWT_SECRET=your-secret-key
CLIENT_URL=http://127.0.0.1:5173
```

## Frontend Environment Variables (`frontend/.env`)

```env
VITE_API_URL=http://127.0.0.1:5000
```

---

# Database Seeding

Run the following command to seed sample data:

```bash
npm run seed
```

---

# Running the Application

Start the development server:

```bash
npm run dev
```

Frontend URL:

```bash
http://127.0.0.1:5173
```

Backend Health Check:

```bash
http://127.0.0.1:5000/health
```

---

# Demo Accounts

| Role       | Email                      |
|------------|----------------------------|
| Admin      | admin@busbeacon.test       |
| Driver     | driver@busbeacon.test      |
| Conductor  | conductor@busbeacon.test   |
| Parent     | parent@busbeacon.test      |
| Student    | student@busbeacon.test     |

Default Password:

```bash
Password123!
```

---

# API Endpoints

## Authentication

```http
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
```

## Trips

```http
GET  /api/trips
GET  /api/trips/active
POST /api/trips/start
POST /api/trips/:id/end
```

## Attendance

```http
GET  /api/attendance
GET  /api/attendance/summary
POST /api/attendance/scan
```

## Notifications

```http
GET   /api/notifications
POST  /api/notifications/emergency
PATCH /api/notifications/:id/read
```

---

# Attendance Verification Logic

The system validates attendance using:

- QR code verification
- Active trip validation
- GPS-based location verification
- Geofence proximity checks
- Route verification
- Bus-stop assignment validation

This ensures students cannot fake attendance records.

---

# Deployment

## Backend Deployment

Recommended platforms:
- Render
- Railway

## Frontend Deployment

Recommended platforms:
- Vercel
- Netlify

## Database

- MongoDB Atlas Free Tier

---

# Screenshots

Add screenshots after deployment:

- Login Page
- Admin Dashboard
- Live Bus Tracking
- QR Attendance Scanner
- Parent Dashboard
- Student Dashboard

---

# Future Enhancements

- AI-based ETA prediction
- Face recognition attendance
- Multi-school support
- Offline attendance synchronization
- SMS alert integration
- Driver performance analytics

---

# Contributing

Contributions, improvements, and suggestions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# License

This project is licensed under the MIT License.
