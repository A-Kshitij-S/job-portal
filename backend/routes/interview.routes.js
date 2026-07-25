import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js"
import { getInterviewHistory, startInterview, submitAnswer } from "../controllers/interview.controller.js"


const router = express.Router()

router.route("/start").post(isAuthenticated, startInterview)
router.route("/answer").post(isAuthenticated, submitAnswer)
router.route("/history").get(isAuthenticated, getInterviewHistory)

export default router
