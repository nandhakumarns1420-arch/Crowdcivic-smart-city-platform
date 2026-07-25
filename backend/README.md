# 🚀 CrowdCivic – Smart City Civic Issue Reporting Platform

<div align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-darkgreen?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38BDF8?logo=tailwind-css)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Storage-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A Full-Stack Smart City Civic Issue Reporting Platform**

Report • Track • Manage • Resolve Civic Issues Efficiently

</div>

---

# 📌 Overview

CrowdCivic is a full-stack web application designed to simplify communication between citizens and municipal authorities. The platform enables citizens to report civic issues such as potholes, garbage accumulation, broken streetlights, drainage problems, and water leakage with supporting images and location details.

Administrators can review complaints, assign them to departments, update complaint statuses, and monitor analytics through a centralized dashboard.

The project aims to improve transparency, accountability, and efficiency in civic issue management while promoting citizen participation in building smarter cities.

---

# ✨ Key Features

### 👤 Citizen Portal

- User Registration & Login
- Secure JWT Authentication
- Submit Civic Complaints
- Upload Evidence Images
- Complaint Tracking using Tracking ID
- Complaint Timeline
- Duplicate Complaint Detection
- Notifications
- Complaint History
- Responsive User Dashboard

---

### 🛠️ Admin Portal

- Admin Authentication
- Complaint Management
- Update Complaint Status
- Assign Departments
- Resolution Notes
- Upload Resolution Images
- Analytics Dashboard
- Complaint Statistics
- Citizen Verification
- Dashboard Reports

---

### 🔒 Security Features

- JWT Authentication
- Password Encryption using bcrypt
- Protected Routes
- Role-Based Authorization
- Secure API Access
- Environment Variable Configuration

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- Recharts

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Cloudinary
- Multer

---

# 🏗 System Architecture

```
Citizen
      │
      ▼
React Frontend
      │
      ▼
Express REST API
      │
      ▼
MongoDB Atlas
      │
      ▼
Cloudinary
```

---

# 📁 Project Structure

```
CrowdCivic
│
├── frontend
│   ├── public
│   ├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── services
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env.example
│
├── assets
├── README.md
└── .gitignore
```

---

# 📸 Application Screenshots

## Landing Page

![Landing Page](assets/landing-page.png)

---

## Citizen Dashboard

![Citizen Dashboard](assets/citizen-dashboard.png)

---

## Admin Dashboard

![Admin Dashboard](assets/admin-dashboard.png)

---

## Complaint Details

![Complaint Details](assets/complaint-details.png)

---

## Analytics Dashboard

![Analytics Dashboard](assets/analytics-dashboard.png)

---

## Live Map

![Live Map](assets/live-map.png)

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/nandhakumarns1420-arch/Crowdcivic-smart-city-platform.git

cd Crowdcivic-smart-city-platform
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

# 📡 REST API Modules

- Authentication API
- User API
- Complaint API
- Admin API
- Notification API
- Dashboard API
- Analytics API
- Image Upload API

---

# 🎯 Future Enhancements

- Email Notifications
- SMS Alerts
- AI-Based Duplicate Complaint Detection
- GIS Mapping Integration
- Mobile Application
- Real-Time Complaint Tracking
- Government Portal Integration

---

# 👨‍💻 Author

**Nandhakumar M**

Master of Computer Applications (MCA)

PSNA College of Engineering and Technology

GitHub:

https://github.com/nandhakumarns1420-arch

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

---

## 📄 License

This project is licensed under the MIT License.