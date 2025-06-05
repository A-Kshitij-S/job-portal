import { Company } from "../models/company.model.js";

export const registerCompany= async(req, res)=>{
    try {
        const {companyName}= req.body
        if(!companyName){
            return res.status(400).json({
                message:"company name is required ",
                success:false
            })
        }
        let company= await Company.findOne({name:companyName})
        if(company){
            return res.status(400).json({
                message:"company is already registered",
                success: false
            })
        }
        company= await Company.create({
            name:companyName,
            userId:req.id
        })
        return res.status(200).json({
            message:"company registered successfully",
            company,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getCompany= async (req, res)=>{
    try {
        const userId= req.id
        const company= await Company.find({userId})
        if(!company){
            return res.status(404).json({
                message:"company not found",
                success:false
            })
        }
        return res.status(200).json({
            message:"company found",
            company,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}