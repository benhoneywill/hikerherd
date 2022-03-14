import { Cloudinary } from "cloudinary-core";

const cloudinaryClient = new Cloudinary({
  cloud_name: process.env.BLITZ_PUBLIC_CLOUDINARY_CLOUD_NAME,
  secure: true,
});

export default cloudinaryClient;
