import axios from "axios"

const INTERVIEW_SERVICE_URL = process.env.INTERVIEW_SERVICE_URL
const INTERNAL_SERVICE_KEY = process.env.INTERNAL_SERVICE_KEY

// START A NEW MOCK INTERVIEW SESSION
export const startInterview = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            });
        }

        const response = await axios.post(
            `${INTERVIEW_SERVICE_URL}/interview/start`,
            { userId, jobId },
            {
                headers: { "X-Internal-Key": INTERNAL_SERVICE_KEY },
                timeout: 30000
            }
        );

        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error.message, error.response?.status, error.response?.data);
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || error.response.data?.detail || "Interview service returned an error",
                success: false
            });
        }
        return res.status(503).json({
            message: "Interview service is currently unavailable",
            success: false
        });
    }
};

// SUBMIT AN ANSWER FOR THE CURRENT INTERVIEW TURN
export const submitAnswer = async (req, res) => {
    try {
        const userId = req.id;
        const { sessionId, answer } = req.body;

        if (!sessionId || !answer) {
            return res.status(400).json({
                message: "Session ID and answer are required",
                success: false
            });
        }

        const response = await axios.post(
            `${INTERVIEW_SERVICE_URL}/interview/answer`,
            { userId, sessionId, answer },
            {
                headers: { "X-Internal-Key": INTERNAL_SERVICE_KEY },
                timeout: 30000
            }
        );

        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error.message, error.response?.status, error.response?.data);
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || error.response.data?.detail || "Interview service returned an error",
                success: false
            });
        }
        return res.status(503).json({
            message: "Interview service is currently unavailable",
            success: false
        });
    }
};

// GET PAST INTERVIEW SESSIONS FOR THE LOGGED-IN USER
export const getInterviewHistory = async (req, res) => {
    try {
        const userId = req.id;

        const response = await axios.get(
            `${INTERVIEW_SERVICE_URL}/interview/history`,
            {
                params: { userId },
                headers: { "X-Internal-Key": INTERNAL_SERVICE_KEY },
                timeout: 15000
            }
        );

        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error.message, error.response?.status, error.response?.data);
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || error.response.data?.detail || "Interview service returned an error",
                success: false
            });
        }
        return res.status(503).json({
            message: "Interview service is currently unavailable",
            success: false
        });
    }
};
