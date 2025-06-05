import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utlis/db.js"
import userRouter from "./routes/user.routes.js"
 

dotenv.config({})
const PORT= process.env.PORT || 4000
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const corsOption={
    origin:'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOption))


app.use("/api/v1/user", userRouter)
 
 
app.listen(PORT, ()=>{
    connectDB()
    console.log(`server running fine at ${PORT}`)
})