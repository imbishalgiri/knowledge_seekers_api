import BaseCloudinary from "cloudinary";
const cloudinary = BaseCloudinary.v2;
import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new (CloudinaryStorage as any)({
  cloudinary: cloudinary,
  params: {
    folder: "knowledge_seekers",
  },
});

const parser = multer({ storage: storage });
export default parser;
