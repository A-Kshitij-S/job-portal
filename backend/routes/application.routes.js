import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js"
import { applyJob, getApplicants, getAppliedJob, updateStatus } from "../controllers/application.controller.js"


const router= express.Router()

router.route("/apply/:id").post(isAuthenticated ,applyJob)
router.route("/get").get(isAuthenticated, getAppliedJob)
router.route("/:id/applicants").get(isAuthenticated, getApplicants)
router.route("/status/:id/update").post(isAuthenticated, updateStatus)

export default router