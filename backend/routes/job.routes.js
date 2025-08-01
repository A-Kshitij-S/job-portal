import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import { createJob, getAdminJobs, getAllJobs, getJobById } from "../controllers/job.controller.js";

const router= express.Router()

router.route("/post").post(isAuthenticated,createJob)
router.route("/get").get(isAuthenticated,getAllJobs)
router.route("/get/:id").get(isAuthenticated,getJobById)
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs)

export default router
