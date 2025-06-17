import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utlis/cloudinary.js";
import getDataUri from "../utlis/datauri.js";
import streamifier from "streamifier";
import path from "path";

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already registered",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({
      message: "user created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
      return res.status(400).json({
        message: "all fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "user does not exist",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "incorrect credentials",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }

    const tokenData = {
      id: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    


    user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // true if HTTPS
        sameSite: "Lax", // "None" if you're on cross-domain HTTPS
        path: "/", // ❗ very important
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    // console.log("Cookies:", req.cookies);
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        path: "/", // ❗ must match login cookie path
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { fullName, email, phoneNumber, bio, skills } = req.body;
//     const file = req.file;

//     const userId = req.id;
//     let user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({
//         message: "Login before updating",
//         success: false,
//       });
//     }

//     // import streamifier from "streamifier";

//     const uploadPromise = new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           resource_type: "raw",
//           public_id: publicId, // must end with .pdf
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );

//       streamifier.createReadStream(file.buffer).pipe(uploadStream);
//     });

//     const cloudResponse = await uploadPromise;

//     // Update user fields
//     if (fullName) user.fullName = fullName;
//     if (email) user.email = email;
//     if (phoneNumber) user.phoneNumber = phoneNumber;
//     if (bio) user.profile.bio = bio;

//     const skillsArray = skills ? skills.split(",") : [];
//     user.profile.skills = skillsArray;

//     if (cloudResponse) {
//       user.profile.resume = cloudResponse.secure_url;
//       user.profile.resumeOriginalName = file.originalname;
//     }

//     await user.save();

//     const updatedUser = {
//       id: user._id,
//       fullName: user.fullName,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile: user.profile,
//     };

//     return res.status(200).json({
//       message: "User updated successfully",
//       user: updatedUser,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error in updateProfile:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "Login before updating",
        success: false,
      });
    }

    let cloudResponse;

    if (file) {
      // ✅ Check if it's a PDF
      if (file.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed for resumes.",
        });
      }

      // ✅ Define publicId with .pdf extension
      const publicId = `resumes/${userId}_${Date.now()}.pdf`;

      // ✅ Upload using streamifier
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            public_id: publicId,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      cloudResponse = await uploadPromise;
    }

    // ✅ Update user fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    user.profile.skills = skills ? skills.split(",") : [];

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    const updatedUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
