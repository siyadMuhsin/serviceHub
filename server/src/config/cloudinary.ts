import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


export class CloudinaryService {
    static uploadImage(file: Express.Multer.File): Promise<string | null> {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "images", resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(null);
            } else {
              resolve(result?.secure_url || null);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    }
  }
export default cloudinary;
