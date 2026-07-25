import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utlis/db.js"
import userRouter from "./routes/user.routes.js"
import companyRoute from "./routes/company.routes.js"
import jobRoute from "./routes/job.routes.js"
import applicationRoute from "./routes/application.routes.js"
import interviewRoute from "./routes/interview.routes.js"
import isAuthenticated from "./middlewares/isAuthenticated.middleware.js"


dotenv.config({})
const PORT= process.env.PORT || 4000
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(cors({
  origin: ["https://job-portal-frontend-u84g.onrender.com", "http://localhost:5173"],
  credentials: true,
}));

app.use("/api/v1/user", userRouter)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", jobRoute)
app.use("/api/v1/application", applicationRoute)
app.use("/api/v1/interview", interviewRoute)
app.get("/ping", (req, res) => {
  console.log("Cookies:", req.cookies);
  res.send("pong");
});

 
app.listen(PORT, ()=>{
    connectDB()
    console.log(`server running fine at ${PORT}`)
})