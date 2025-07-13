# Job Interview Portal

A fullstack job interview portal that streamlines the recruitment process by allowing recruiters to post jobs and manage applicants, while job seekers can track their application status in real-time.

---

##  Features

### For Recruiters
- **Create, update, and delete job listings**
- **View and manage applicants** for each job
- **Update interview stages and application status**
- **Role-based access** to protect recruiter functionalities
- **Recruiter dashboard** to track job postings and applicants

###  For Applicants
- **Browse and filter job listings** by keywords or role
- **Apply to jobs** with resume and profile upload
- **Track application history** and current interview stage
- **Applicant dashboard** to monitor application status

###  Common Features
- **Secure authentication with JWT**
- **Role-based protected routes and dynamic UI rendering**
- **File upload** for resume & profile images via **Cloudinary**
- **Form validation and error handling** across frontend & backend

---

## 🛠 Tech Stack

**Frontend:** React, Tailwind CSS, ShadCN UI, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Others:** JWT, Multer, Cloudinary, CORS, bcrypt

---

##  Key Functionalities

-  Real-time updates of application status  
-  Search & filter functionality for job listings  
-  Pagination & infinite scroll for jobs/applicants  
-  Middleware-protected routes for recruiters/applicants  
-  Clean and responsive UI with ShadCN and Tailwind  
-  Error boundary and toast notifications for user feedback

---

##  Testing

-  Manual testing of key flows: job creation, application, status update  
-  Backend API tested with **Postman** 

---

##  Security

- Passwords hashed with **bcrypt**
- JWT-based authentication with role checks
- Uploads validated to prevent malicious file injection







