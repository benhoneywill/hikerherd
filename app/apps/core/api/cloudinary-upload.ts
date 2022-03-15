import type { BlitzApiHandler, BlitzApiRequest } from "blitz";

import { getSession } from "blitz";

import { Formidable } from "formidable";

import cloudinary from "integrations/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFile = (req: BlitzApiRequest) => {
  return new Promise((resolve, reject) => {
    const form = new Formidable();

    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      if (typeof fields.folder !== "string") {
        return reject(new Error("You must provide a folder"));
      }

      if (typeof fields.filename !== "string") {
        return reject(new Error("You must provide a filename"));
      }

      if (!files.file) {
        return reject(new Error("No file found"));
      }

      if (Array.isArray(files.file)) {
        return reject(new Error("Only one file can be uploaded at a time"));
      }

      cloudinary.uploader.upload(
        files.file.filepath,
        {
          folder: `${process.env.NODE_ENV}/${fields.folder}`,
          public_id: fields.filename,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });
};

const cloudinaryUploadHandler: BlitzApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getSession(req, res);

    if (!session.userId) {
      return res.status(401).end();
    }

    try {
      const result = await uploadFile(req);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json(error);
    }
  } else {
    return res.status(404).end();
  }
};

export default cloudinaryUploadHandler;
