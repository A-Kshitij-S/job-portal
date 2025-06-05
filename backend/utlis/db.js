import mongoose from "mongoose";

const connectDB= async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongoose database connected successfully")
    } catch (error) {
        console.log("failed to connect mongoose database")
    }
}

export default connectDB