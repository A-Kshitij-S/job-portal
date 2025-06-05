import mongoose from "mongoose";

const jobSchema= new mongoose.Schema({
    title:{
        type:String,
        default:"",
        required:true
    },
    descriptions:{
        type:String,
        default:"",
        required:true
    },
    requirements:[{
        type:String,
        default:"",
        required:true
    }],
    experienceLevel:{
        type: String,
        default: "",
        required: true
    },
    salary:{
        type: Number,
        required: true
    },
    location:{
        type:String,
        required: true
    },
    jobType:{
        type:String,
        required: true
    },
    position:{
        type:String,
        required: true
    },
    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        req: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        req: true
    },
    application:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Application'
    }]
}, {timestamps:true});

export const Job= mongoose.model("Job", jobSchema)