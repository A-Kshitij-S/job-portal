import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utlis/db.js"
import userRouter from "./routes/user.routes.js"
import companyRoute from "./routes/company.routes.js"
import jobRoute from "./routes/job.routes.js"
import applicationRoute from "./routes/application.routes.js"
import isAuthenticated from "./middlewares/isAuthenticated.middleware.js"


dotenv.config({})
const PORT= process.env.PORT || 4000
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true,
}));


app.use("/api/v1/user", userRouter)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", jobRoute)
app.use("/api/v1/application", applicationRoute)


app.get("/test-auth", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "You're authenticated", userId: req.id });
});


// app.get("/logout", (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     sameSite: "Lax",
//     secure: false,
//     path: "/"
//   });
//   res.status(200).json({ message: "Logged out" });
// });

 
app.listen(PORT, ()=>{
    connectDB()
    console.log(`server running fine at ${PORT}`)
})