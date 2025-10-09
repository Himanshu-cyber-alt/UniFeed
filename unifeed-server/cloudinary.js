import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: 'dgkehwmjm',
  api_key: 561693257598439,
  api_secret: 'EGy41Y5sj1Hm7Dp8I8nPIVeifSk',
});

export default cloudinary;
