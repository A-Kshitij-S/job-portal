import { Job } from "../models/job.model.js";

export const createJob = async (req, res) => {
    try {
        const { title, descriptions, requirements, experience, salary, location, jobType, position, companyId } = req.body;
        const userId= req.id
        if (!title || !descriptions || !requirements || !experience || !salary || !location || !jobType || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const job = await Job.create({
            title,
            descriptions,
            requirements: requirements.split(','),
            experienceLevel: experience,
            salary,
            location,
            jobType,
            position,
            company: companyId, 
            createdBy: userId 
        });

        return res.status(201).json({
            message: "Job created successfully",
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getAllJobs= async(req, res)=>{
    try {
        const keyword= req.query.keyword || ""
        const query={
            $or:[
                {title: {$regex: keyword, $options: "i"}},
                {descriptions: {$regex: keyword, $options: "i"}},
            ]
        }
        const jobs= await Job.find(query).populate({
            path:"company"
        }).sort({createdAt: -1})
        if(!jobs || jobs.length === 0){
            return res.status(404).json({
                message: "No jobs found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Jobs retrieved successfully",
            jobs,
            success: true
        }); 
    } catch (error) {
        console.log(error)
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        })
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        
        return res.status(200).json({
            message: "Job retrieved successfully",
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getAdminJobs= async(req, res)=>{
    try {
        const adminId= req.id
        const job= await Job.find({createdBy: adminId}).populate({
            path:"company",
            createdAt:-1
        })
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        
        return res.status(200).json({
            message: "Job retrieved successfully",
            job,
            success: true
        });
    } catch (error) {
        
    }
}