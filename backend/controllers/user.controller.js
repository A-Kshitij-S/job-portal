import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import getDataUri from "../utlis/dataUri.js";
import cloudinary from "../utlis/cloudinary.js";

export const register= async (req, res) => {
    try{
        const { fullName, email, phoneNumber, password , role} = req.body;
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ 
                message: "All fields are required",
                success: false
            });
        }
        const file= req.file
        const fileUri= getDataUri(file)
        const cloudResponse= await cloudinary.uploader.upload(fileUri.content)


        const user= await User.findOne({email})
        if(user){
            return res.status(400).json({
                message:"user already registered",
                success:false
            })
        }
        
        const hashedPassword= await bcrypt.hash(password, 10);
 
        await User.create({
            fullName,
            email,
            phoneNumber, 
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse.secure_url
            }
        })

        return res.status(201).json({
            message: "user created successfully",
            success: true
        })
    }
    catch(error){
        console.log(error)
    }
}

export const login= async(req, res)=>{
    try {
        const {role, email, password}= req.body
        if(!role || !email || !password){
            return res.status(400).json({
                message:"all fields are required",
                success:false
            })
        }
    
        let user= await User.findOne({email})
        if(!user){
            return res.status(200).json({
                message:"user does not exist",
                success: false
            })
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({
                message:"incorrect credentials",
                success: false
            })
        }
    
        if(role !== user.role){
            return res.status(400).json({
                message:"Account does not exist with current role",
                success: false
            })
        }
    
        const tokenData={
            id: user._id
        }
    
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn:'1d'})
    
        user= {
            id: user._id,
            fullName:user.fullName,
            email: user.email,
            phoneNumber:user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, 
            {
                maxAge: 1*24*60*60*1000, 
                httpsOnly:true,
                sameSite:'strict'
            }).json({
                message: `welcome back ${user.fullName}`,
                user,
                success: true
            })
    } catch (error) {
        console.log(error)
    }
}

export const logout= async(req, res)=>{
    try {
        return res.status(200).cookie("token", "")
        .json({
            message: "user logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateProfile= async(req,res)=>{
    try {
        const { fullName, email, phoneNumber, bio , skills} = req.body;
        const file= req.file
        const fileUri= getDataUri(file)
        const cloudResponse= await cloudinary.uploader.upload(fileUri.content)

        let skillsArray
        if(skills) skillsArray= skills.split(',')
            
        const userId= req.id
        let user= await User.findOne({userId})
        if(!user){
            return res.status(400).json({
                message:"login before updating",
                success:false
            })
        }

        if(fullName) user.fullName= fullName
        if(email) user.email= email
        if(phoneNumber) user.phoneNumber= phoneNumber
        if(bio) user.profile.bio= bio
        if(skills) user.profile.skills= skillsArray


        if(cloudResponse){
            user.profile.resume= cloudResponse.secure_url
            user.profile.resumeOriginalName= file.originalname
        }

        await user.save()

        user= {
            id: user._id,
            fullName:user.fullName,
            email: user.email,
            phoneNumber:user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"user updated successfully",
            user,
            success:true
        })

    } catch (error) {
        console.log(error)
    }
} 