import apiRequest from "./api-request";

type CloudinaryUploadOptions = {
  filename: string;
  folder: string;
};

type CloudinaryUploadResponse = {
  url: string;
};

const uploadImageToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions
) => {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", options.folder);
  body.append("filename", options.filename);

  return apiRequest<CloudinaryUploadResponse>("/api/cloudinary-upload", {
    method: "POST",
    body,
  });
};

export default uploadImageToCloudinary;
