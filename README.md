erro em salvar as informacao 





# Admin Panel

A Next.js 14 admin panel with Firebase Authentication and Firestore, featuring a dashboard with map, user management, alerts, and admin registration.

## Features

- Admin login using Firebase Authentication
- Dashboard with Leaflet map displaying geolocated alerts
- User management (list users)
- Alerts validation (approve/reject)
- Admin registration
- Logout functionality
- Responsive design with TailwindCSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Firebase:
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase config to `.env.local`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js App Router pages
- `components/`: Reusable React components
- `lib/`: Firebase and auth utilities
- `styles/`: Global styles
- `public/`: Static assets

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Firebase (Authentication & Firestore)
- Leaflet (Map)
