# Job Interview Portal

A full-stack job interview platform designed to streamline the hiring process. Recruiters can post jobs and manage applicants, while job seekers can browse listings, apply, and track their application status in real-time.

---

## Demo Website

-([https://job-portal-frontend-u84g.onrender.com])

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

**Frontend:** React, Tailwind CSS, ShadCN UI, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Additional Tools:** JWT, Multer, Cloudinary, CORS, bcrypt

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

## Deployment

This project is deployed on **Render**:

**Frontend:** ([https://your-frontend-url.onrender.com](https://job-portal-frontend-u84g.onrender.com))  
**Backend:** ([https://your-backend-url.onrender.com](https://job-portal-backend-v3w0.onrender.com))


