# Job Interview Portal

A full-stack job interview platform designed to streamline the hiring process. Recruiters can post jobs and manage applicants, while job seekers can browse listings, apply, and track their application status in real-time.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Render Deployment](https://img.shields.io/badge/Hosted%20on-Render-blue)](https://render.com/)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-yellowgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://mongodb.com/)
[![Python](https://img.shields.io/badge/AI%20Service-Python-3776AB)](https://python.org/)
[![LangGraph](https://img.shields.io/badge/Agent-LangGraph-1C3C3C)](https://langchain-ai.github.io/langgraph/)

---

## Demo Website

**Frontend:** [https://job-portal-frontend-u84g.onrender.com](https://job-portal-frontend-u84g.onrender.com)  
**Backend:** [https://job-portal-backend-v3w0.onrender.com](https://job-portal-backend-v3w0.onrender.com)

> The AI Mock Interview feature requires `interview-service/` to be running and reachable from the backend. It isn't part of the current live Render deployment yet — see [Installation and Setup](#installation-and-setup) to run it locally.

<img width="1261" height="667" alt="image" src="https://github.com/user-attachments/assets/70cd5e76-a9c9-4a1b-8724-2fdb07e11d78" /> <br>
<img width="1282" height="662" alt="image" src="https://github.com/user-attachments/assets/5d859eee-70cd-46da-88b2-05a6fdfea43c" /> <br>
<img width="1470" height="837" alt="image" src="https://github.com/user-attachments/assets/5ac05f57-f8f1-49cf-b2bc-19f919248ccd" />
<img width="1279" height="676" alt="image" src="https://github.com/user-attachments/assets/aa3420fc-81c1-459f-8586-b637ff27daf6" /> <br>
<img width="1263" height="667" alt="image" src="https://github.com/user-attachments/assets/c00bcebb-c1d9-40c9-ac11-8a0b7ea54969" /> <br>




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

### AI Mock Interview
A candidate-facing practice interview, launched from any job posting, backed by a standalone Python/LangGraph agent service (`interview-service/`):
- **Agentic workflow** — a 9-node LangGraph graph with adaptive difficulty (1–5) and a follow-up mechanism that probes vague or non-answers before moving to the next topic
- **RAG-grounded questions** — retrieval over the job description, the candidate's parsed resume, and live company research, indexed per-session with FAISS
- **Autonomous tool use** — the interviewer LLM decides for itself when to pull more context from the indexed materials or search the live web for the company, via LangChain tool-calling
- **Human-in-the-loop** — the graph pauses mid-conversation (`interrupt()`) waiting for each candidate answer, and survives a service restart mid-interview via MongoDB-backed checkpointing
- **Long-term memory** — weak topics and scores are tracked per candidate across sessions, informing the starting difficulty of future interviews

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

**AI Interview Microservice** (`interview-service/`, standalone Python service)
- Python, FastAPI
- LangGraph (agentic workflow, checkpointing, long-term memory store)
- LangChain (tool-calling, structured output)
- FAISS + sentence-transformers (local embeddings, no external API needed)
- Tavily (live web search for company research)
- NVIDIA NIM API (LLM inference — `openai/gpt-oss-20b`, OpenAI-SDK compatible so any OpenAI-compatible provider can be swapped in via config)

---

## Key Functionalities

- Real-time application status tracking
- Job search and filtering capabilities
- Pagination and infinite scrolling for listings
- Middleware-protected API routes
- Clean and responsive UI built with modern component libraries
- Error boundaries and toast notifications for user feedback
- AI-powered mock interview practice with adaptive difficulty, retrieval-grounded questions, and cross-session progress tracking

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
   INTERVIEW_SERVICE_URL=http://localhost:5001
   INTERNAL_SERVICE_KEY=your_shared_internal_key
   ```

4. Setup the AI interview microservice (separate Python service — required for the "Start Mock Interview" feature; the rest of the app works without it)
   ```
   cd ../interview-service
   python3 -m venv .venv
   source .venv/bin/activate    # .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

   Create a `.env` file inside `interview-service/` with:
   ```
   MONGO_URI=your_mongodb_uri
   NVIDIA_API_KEY=your_nvidia_api_key
   TAVILY_API_KEY=your_tavily_api_key
   INTERNAL_SERVICE_KEY=your_shared_internal_key
   PORT=5001
   ```
   `INTERNAL_SERVICE_KEY` must match the value in `backend/.env` — the two services use it to authenticate requests to each other. Get a free `NVIDIA_API_KEY` at [build.nvidia.com](https://build.nvidia.com/openai/gpt-oss-20b) (the LLM call in `interview-service/app/config.py` is OpenAI-SDK compatible, so any OpenAI-compatible endpoint/key can be swapped in instead).

   Start it:
   ```
   uvicorn app.main:app --port 5001
   ```

5. Start the backend server
   ```
   cd ../backend
   npm start
   ```

6. Setup the frontend
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
├── interview-service/
│   ├── app/
│   │   ├── api/           # FastAPI routes and request/response schemas
│   │   ├── graph/         # LangGraph state, nodes, edges, tools, and the compiled graph
│   │   ├── rag/           # embeddings, FAISS index, resume/job loaders
│   │   ├── integrations/  # MongoDB and Tavily clients
│   │   ├── memory/        # long-term memory store and session registry
│   │   ├── config.py
│   │   └── main.py
│   └── requirements.txt
└── README.md
```

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Notes

- Resume files are uploaded securely via Cloudinary.
- Make sure to add proper environment variables for production deployment.
- The AI interview microservice (`interview-service/`) is a separate Python codebase with its own dependencies and `.env` — it must be running for the "Start Mock Interview" feature to work, but the rest of the app functions without it.
- This project is intended for learning.
