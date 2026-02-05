Appointment Management – React Frontend

Frontend εφαρμογή διαχείρισης κατηγοριών και ραντεβού, υλοποιημένη με React + Vite.
Συνδέεται με Spring Boot backend μέσω REST API και JWT authentication.

##Τεχνολογίες
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- React Hot Toast
- Lucide Icons
- 
##Λειτουργίες
- Προβολή κατηγοριών ραντεβού
- Προβολή ραντεβού ανά κατηγορία
- Login με JWT
- Role-based UI
- CRUD Categories & Appointments
- Toast notifications
- Protected routes
- 
##Roles
Visitor: προβολή κατηγοριών και ραντεβού
OWNER: πλήρης διαχείριση και πρόσβαση
Πώς τρέχει το project
1. git clone <frontend-repo-url>
2. cd appointment-ui
3. npm install
4. npm run dev
Τρέχει στο http://localhost:5173
Backend: http://localhost:8080

##Authentication
POST /api/auth/login
Demo credentials:
username: owner
password: 1234

##Routing
/ Categories
/categories/:id
/login
/appointments/new
/appointments/:id/edit

##UI / UX
Tailwind CSS, cards layout, tables, toast notifications, footer.

*****Video Demo

Το repository περιλαμβάνει screen recording της εφαρμογής σε λειτουργία, παρουσιάζοντας το authentication, τη διαχείριση δεδομένων και το role-based UI.

