import mongoose from "mongoose";

const applicationSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    coverLetter: {
        type: String,
        default: ""
    },
    resume: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const Application= mongoose.model("Application", applicationSchema);