# BusBeacon

BusBeacon is a production-ready full-stack school bus tracking and attendance management system. It uses free and open-source tooling: OpenStreetMap, Leaflet.js, Socket.IO, MongoDB Atlas free tier, Firebase Cloud Messaging free tier, React + Vite, Tailwind CSS, Node.js, Express, JWT, and bcrypt.

> Project note: the requested overview mentioned SafeRoute, but the application generated here is named BusBeacon throughout.

## Features

- JWT login/logout with role-based authorization.
- Admin dashboard for buses, routes, stops, users, students, live trips, and reports.
- Driver dashboard for trip start/end and continuous Browser Geolocation sharing.
- Conductor dashboard with `html5-qrcode` scanner and secure QR attendance validation.
- Parent and student dashboards with live bus tracking, route polyline, stop markers, ETA, and history.
- Attendance validation requires an active trip, active GPS, route membership, assigned bus, assigned stop, and geofence proximity.
- Haversine geofencing with configurable stop radius.
- Socket.IO live tracking and emergency event support.
- Firebase Cloud Messaging service integration with graceful local dry-run mode.
- Responsive Tailwind UI with dark mode and PWA manifest.
- Seed data for local testing.

## Architecture

```text
BusBeacon
|-- backend
|   |-- src/config        # env and Mongo connection
|   |-- src/controllers   # REST controllers
|   |-- src/middleware    # auth and error handling
|   |-- src/models        # Mongoose schemas
|   |-- src/routes        # API routes
|   |-- src/services      # FCM and notifications
|   |-- src/sockets       # Socket.IO live GPS
|   |-- src/utils         # Haversine, JWT helpers
|   `-- src/seed          # sample data
|-- frontend
|   |-- src/api           # Axios and Socket.IO clients
|   |-- src/components    # UI and map components
|   |-- src/context       # Auth provider
|   |-- src/layouts       # Dashboard shell
|   |-- src/pages         # Role dashboards
|   `-- public            # PWA manifest/icon
`-- .github/ISSUE_TEMPLATE
```

## Local Setup

Prerequisites:

- Node.js 20+
- npm
- MongoDB local instance or MongoDB Atlas free cluster

Install dependencies:

```bash
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/busbeacon
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://127.0.0.1:5173
```

Seed the database:

```bash
npm run seed
```

Run the full stack:

```bash
npm run dev
```

Frontend: `http://127.0.0.1:5173`

Backend health check: `http://127.0.0.1:5000/health`

## Seed Accounts

All seed accounts use password `Password123!`.

| Role | Email |
| --- | --- |
| Admin | `admin@busbeacon.test` |
| Driver | `driver@busbeacon.test` |
| Conductor | `conductor@busbeacon.test` |
| Parent | `parent@busbeacon.test` |
| Student | `student@busbeacon.test` |

The seed script prints a sample student QR value for scanner testing.

## Attendance Rules

Students cannot mark attendance. Attendance can only be created through:

```http
POST /api/attendance/scan
```

The backend verifies:

- authenticated user is conductor or admin
- conductor is assigned to the bus
- active trip exists
- bus GPS coordinates exist
- student QR is valid
- student belongs to the bus and route
- bus is within the assigned stop radius
- attendance is not already marked for that trip

## API Summary

Authentication:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `POST /api/auth/fcm-token`

Resources:

- `/api/buses`
- `/api/routes`
- `/api/stops`
- `/api/students`
- `/api/parents`
- `/api/users`

Trips:

- `GET /api/trips`
- `GET /api/trips/active`
- `POST /api/trips/start`
- `POST /api/trips/:id/end`

Attendance:

- `GET /api/attendance`
- `GET /api/attendance/summary`
- `POST /api/attendance/scan`

Notifications:

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `POST /api/notifications/emergency`

Socket.IO events:

- `join:trip`
- `driver:location`
- `bus:location`
- `admin:bus-location`
- `sos`
- `emergency`

## Firebase Cloud Messaging

FCM is optional in local development. If Firebase Admin credentials are missing, notification sends are logged as dry runs and database notifications still work.

Set these in `backend/.env` for production:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Set these in `frontend/.env` when adding browser push registration:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Deployment

### MongoDB Atlas Free Tier

1. Create a free M0 cluster.
2. Create a database user.
3. Add your Render outbound IP or temporarily allow `0.0.0.0/0`.
4. Copy the connection string into `MONGODB_URI`.

### Backend on Render Free Tier

1. Create a new Web Service from the GitHub repository.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `backend/.env.example`.
6. Set `CLIENT_URL` to the Vercel frontend URL.

### Frontend on Vercel Free Tier

1. Import the GitHub repository.
2. Framework preset: Vite
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add `VITE_API_URL` with the Render backend URL.

## Screenshots

Add screenshots here after deployment:

- Login screen
- Admin live map
- Driver trip controls
- Conductor QR scanner
- Parent ETA view
- Student route view

## GitHub Push Instructions

```bash
git init
git add .
git commit -m "Initial SafeRoute project setup"
git branch -M main
git remote add origin <github_repo_url>
git push -u origin main
```

To let Codex push this repo for you, provide:

- the GitHub repository URL
- permission to run the push command
- working GitHub authentication on this machine, such as GitHub CLI login, credential manager, or a scoped personal access token

## License

MIT
