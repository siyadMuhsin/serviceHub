import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import Logger from "../config/logger";

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
                        Logger.error(`Upload failed: ${error.message}`);
                        reject(null);
                    } else {
                        Logger.info(`Uploaded: ${result?.secure_url}`);
                        resolve(result?.secure_url || null);
                    }
                }
            );
            uploadStream.end(file.buffer);
        });
    }

    static deleteImage(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
                if (error) {
                    Logger.error(`Delete failed: ${error.message}`);
                    reject(error);
                } else {
                    Logger.info(`Deleted: ${publicId}`);
                    resolve(result);
                }
            });
        });
    }
}

export default cloudinary;