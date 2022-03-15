import apiRequest from "./api-request";

type CloudinaryUploadOptions = {
  filename: string;
  folder: string;
};

type CloudinaryUploadResponse = {
  public_id: string;
  version: number;
};

const uploadImageToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions
) => {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", options.folder);
  body.append("filename", options.filename);

  const data = await apiRequest<CloudinaryUploadResponse>(
    "/api/cloudinary-upload",
    {
      method: "POST",
      body,
    }
  );

  return {
    publicId: data.public_id,
    version: data.version,
  };
};

export default uploadImageToCloudinary;
