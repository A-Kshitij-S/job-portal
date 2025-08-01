import express from "express"
import { getCompany, getCompanyById, registerCompany, updateCompanyInformation } from "../controllers/company.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js"
import { singleUpload } from "../middlewares/multer.middleware.js"


const router= express.Router()

router.route("/register").post(isAuthenticated ,registerCompany)
router.route("/get").get(isAuthenticated, getCompany)
router.route("/get/:id").get(isAuthenticated, getCompanyById)
router.route("/update/:id").put(isAuthenticated,singleUpload ,updateCompanyInformation)

export default router