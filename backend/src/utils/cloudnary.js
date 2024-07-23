
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
      if (!localFilePath) return null;

      // Upload the file to Cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto",
          folder:"files"
      });

      // Remove the locally saved temporary file after successful upload
      fs.unlinkSync(localFilePath);

      return response;
  } catch (error) {
      // Remove the locally saved temporary file if upload fails
      fs.unlinkSync(localFilePath);

      // Log the error for debugging purposes
      console.error("Avatar upload failed:", error);

      return null; // Return null or handle the error as per your application's needs
  }
};


export { uploadOnCloudinary };
// cloudinary.v2.uploader.upload("https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",{folder:"test"},(error,result)=>{
//     if(error){
//         console.log(error)
//     }else{
//         console.log(result)
//     }
// })

