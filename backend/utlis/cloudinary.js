import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
dotenv.config()


cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });


// const uploadResult = await cloudinary.uploader
//        .upload(
//            , {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);

export default cloudinary