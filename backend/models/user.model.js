import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["student", "recruter"],
        required:true,
        default:"student"
    },
    profile:{
        bio:{type:String, default:""},
        skills:[{type:String}],
        resume:{type:String, default:""},
        profilePicture:{type:String, default:""},
        resumeOriginalName:{type:String, default:""},
        company:{type:mongoose.Schema.Types.ObjectId, ref:"Company", default:null},
    }
}, {timestamps:true});

export const User=mongoose.model("User", userSchema);