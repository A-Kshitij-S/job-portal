import { populate } from "dotenv"
import { Application } from "../models/application.model.js"
import { Job } from "../models/job.model.js"


// APPLY FOR A JOB
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "Applicant has already applied",
                success: false
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(400).json({
                message: "Job is not available",
                success: false
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(200).json({
            message: "Applied to job successfully",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
}; 

// GET ALL APPLIED JOBS FOR A USER
export const getAppliedJob = async (req, res) => {
    try {
        const userId = req.id;

        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "company",
                    options: { sort: { createdAt: -1 } }
                }
            });

        if (!applications || applications.length === 0) {
            return res.status(200).json({
                message: "No applications found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Applied jobs found successfully",
            applications,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
};

// GET ALL APPLICANTS FOR A JOB
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
                options: { sort: { createdAt: -1 } }
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "No applicants found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Applicants found",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
};

// UPDATE APPLICATION STATUS
// export const updateStatus = async (req, res) => {
//     try {
//         const { status } = req.body;
//         const applicationId = req.params.id;

//         if (!status) {
//             return res.status(400).json({
//                 message: "Status is required",
//                 success: false
//             });
//         }

//         const application = await Application.findById(applicationId);
//         if (!application) {
//             return res.status(400).json({
//                 message: "Application not found",
//                 success: false
//             });
//         }

//         application.status = status;
//         await application.save();

//         return res.status(200).json({
//             message: "Status updated successfully",
//             application,
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Something went wrong",
//             success: false
//         });
//     }
// };

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            });
        }

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(400).json({
                message: "Application not found",
                success: false
            });
        }

        // console.log("➡️ Found application:", application);

        application.status = status;

        await application.save(); // 🔥 The crash likely happens here

        return res.status(200).json({
            message: "Status updated successfully",
            application,
            success: true
        });

    } catch (error) {
        console.error("🔥 Server Error:", error); // FULL error object
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
};

