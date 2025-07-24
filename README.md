# Job Interview Portal

A full-stack job interview platform designed to streamline the hiring process. Recruiters can post jobs and manage applicants, while job seekers can browse listings, apply, and track their application status in real-time.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Render Deployment](https://img.shields.io/badge/Hosted%20on-Render-blue)](https://render.com/)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-yellowgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://mongodb.com/)

---

## Demo Website

**Frontend:** [https://job-portal-frontend-u84g.onrender.com](https://job-portal-frontend-u84g.onrender.com)  
**Backend:** [https://job-portal-backend-v3w0.onrender.com](https://job-portal-backend-v3w0.onrender.com)

<img width="1261" height="667" alt="image" src="https://github.com/user-attachments/assets/70cd5e76-a9c9-4a1b-8724-2fdb07e11d78" /> <br>
<img width="1282" height="662" alt="image" src="https://github.com/user-attachments/assets/5d859eee-70cd-46da-88b2-05a6fdfea43c" /> <br>


---

## Features

### Recruiter Functionality
- Create, update, and delete job listings
- View and manage applicants per job
- Update interview stages (e.g., Applied → Interview → Hired)
- Secure access to a recruiter dashboard
- Role-based routing to protect recruiter-specific pages

### Applicant Functionality
- Browse and search job listings
- Apply with resume and profile upload
- View application history and current status
- Access to a personal dashboard for managing applications

### Shared Features
- Secure authentication using JWT
- Role-based access control and dynamic UI rendering
- Resume and profile uploads via Cloudinary
- Comprehensive form validation and error handling

---

## Tech Stack

**Frontend**
- React
- Tailwind CSS
- ShadCN UI
- Axios

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Additional Tools**
- JWT
- Multer
- Cloudinary
- CORS
- bcrypt

---

## Key Functionalities

- Real-time application status tracking
- Job search and filtering capabilities
- Pagination and infinite scrolling for listings
- Middleware-protected API routes
- Clean and responsive UI built with modern component libraries
- Error boundaries and toast notifications for user feedback

---

## Testing

- Manual testing of user and recruiter flows
- API endpoints tested using Postman

---

## Security

- Passwords hashed with bcrypt
- JWT-based authentication and role verification
- File uploads validated to prevent malicious content

---

## Installation and Setup

1. Clone the repository
   ```
   git clone https://github.com/your-username/job-portal.git
   cd job-portal
   ```

2. Setup the backend
   ```
   cd backend
   npm install
   ```

3. Create a `.env` file inside `backend/` with:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the backend server
   ```
   npm start
   ```

5. Setup the frontend
   ```
   cd ../frontend
   npm install
   npm run dev
   ```

---

## Folder Structure

```
job-portal/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.jsx
└── README.md
```

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Notes

- Resume files are uploaded securely via Cloudinary.
- Make sure to add proper environment variables for production deployment.
- This project is intended for learning, portfolio, or internal use.
