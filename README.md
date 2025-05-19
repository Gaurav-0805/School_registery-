# 🎓 School Registery System

A full-featured school management system built with Angular, Node.js, Express, and PostgreSQL. This platform manages users (Admin, Teacher, Student), tracks academic data, and ensures secure authentication and role-based access control.

---

## ✨ Features

### 👤 User Roles
- **Admin**
  - Add, View, and Delete any user (Admin, Teacher, or Student)
  - Manage all school data (users, subjects, marks)
- **Teacher**
  - Add subjects
  - Assign marks to students per subject
- **Student**
  - View their subjects
  - View marks per subject

### 📅 Academic Management
- Subject-wise data entry and editing
- Marks management with secure teacher access
- Student dashboard to view academic performance

### 🔐 Secure Authentication
- JWT-based login system
- Role-based access (Admin, Teacher, Student)
- Protected routes and data visibility

### 📊 Visual Analytics (Planned)
- Subject-wise performance charts
- Class performance distribution

### 💡 Additional Highlights
- Clean and responsive UI using **Angular Material**
- Modular codebase structure
- Fully scalable and maintainable architecture

---

## 🧰 Tech Stack

### Frontend
- [Angular](https://angular.io/)
- TypeScript
- HTML & CSS
- [Angular Material](https://material.angular.io/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT (JSON Web Token)](https://jwt.io/)

---

## 📁 Folder Structure

school-registery/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── index.js
│
├── frontend/
│ ├── src/
│ │ ├── app/
│ │ │ ├── components/
│ │ │ ├── pages/
│ │ │ ├── services/
│ │ │ └── ...
│ └── angular.json
│
├── .env
├── package.json
└── README.md


---

## 🚀 Getting Started

### 📦 Clone the Repository

```bash
git clone https://github.com/Gaurav-0805/school-registery.git
cd school-registery


🖥️ Backend Setup
cd backend
npm install

🌐 Frontend Setup
cd frontend
npm install
ng serve

🧪 Development Tips
Build Angular App
ng build


📚 Additional Resources
Angular CLI Overview
Express.js Docs
PostgreSQL Docs
JWT Guide
