import { populate } from "dotenv"
import { Application } from "../models/application.model.js"
import { Job } from "../models/job.model.js"

export const applyJob= async(req, res)=>{
    try {
        const userId= req.id
        const jobId= req.params.id
        if(!jobId){
            return res.status(400).json({
                message:"job id is required",
                success:false
            })
        }
        const existingApplicaton = await Application.findOne({
            job:jobId, 
            applicant:userId
        })
        if(existingApplicaton){
            return res.status(400).json({
                message:"applicant already applied",
                success:false
            })
        }
        const job= await Job.findById(jobId)
        if(!job){
            return res.status(400).json({
                message:"job is not available",
                success:false
            })
        }
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId
        })
        job.application.push(newApplication)
        await job.save()
        return res.status(200).json({
            message:"applied to job successfully",
            job,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAppliedJob= async(req, res)=>{
    try {
        const userId= req.id
        const application= await Application.find({applicant: userId}).sort({createdAt: -1}).populate({
            path:"job",
            options:{sort:{createdAt: -1}},
            populate:{
                path:"company",
                options:{sort:{createdAt:-1}}
            }
        })
        if(!application){
            return res.status(200).json({
                message:"no applications found",
                success:false
            })
        }
        return res.status(200).json({
            message:"applied jobs found successfully",
            application,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}
 
export const getApplicants= async(req, res)=>{
    try {
        const jobId= req.params.id
        const job= await Job.findById(jobId).populate({
            path:"application",
            options: {sort:{createdAt:-1}},
            populate:{
                path:"applicant",
                options: {sort:{createdAt:-1}}
            }
        })
        if(!job){
            return res.status(404).json({
                message:"no applicants found",
                job,
                success:false
            })
        }
        return res.status(200).json({
            message:"applicants found",
            job,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateStatus= async (req,res)=>{
    try {
        const {status}= req.body
        const applicationId= req.params.id
        if(!status){
            return res.status(400).json({
                message:"status is required",
                success:false
            })
        }
        const application= await Application.findById(applicationId)
        if(!application){
            return res.status(400).json({
                message:"application not found",
                success:false
            })
        }
        application.status= status
        await application.save()
        
        return res.status(200).json({
            message:"status updated successfully",
            application,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}