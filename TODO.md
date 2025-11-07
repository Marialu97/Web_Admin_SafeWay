# TODO: Fix Alert Management System Inconsistencies and Add Real-Time Updates

- [x] Update components/Map.tsx: Fix field names (lat/lng instead of latitude/longitude, rua/descricao/cor instead of street/description/color)
- [x] Add real-time updates to Map.tsx using Firestore onSnapshot listener
- [x] Add real-time updates to app/dashboard/lista-alertas/page.tsx using Firestore onSnapshot listener
- [x] Update app/dashboard/alerts/page.tsx to trigger real-time updates after adding alert
- [x] Ensure "Ver no mapa" action focuses the map on the alert location in app/dashboard/page.tsx
- [x] Test the complete flow: add alert -> appears in list and map -> delete alert -> disappears from list and map
