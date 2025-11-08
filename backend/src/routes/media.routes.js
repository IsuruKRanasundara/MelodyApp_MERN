import express from "express";
import { uploadMedia } from "../middlewares/upload.middleware.js";

const router = express.Router();
import { v2 as cloudinary } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";

export const getFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "video" // audio files are under "video"
    });
    return result;
  } catch (error) {
    console.error("Cloudinary error:", error);
  }
};
export const listAllAudioFiles = async () => {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "music_uploads/",  // your folder
    resource_type: "video"     // audio/video category
  });

  return result.resources;
};
router.get("/audio-list", async (req, res) => {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "music_uploads/",
    resource_type: "video"
  });

  res.json({
    files: result.resources.map(item => ({
      url: item.secure_url,
      public_id: item.public_id,
      duration: item.duration
    }))
  });
});
router.get("/audio/:publicId", async (req, res) => {
  const publicId = req.params.publicId;

  try {
    const file = await cloudinary.api.resource(publicId, {
      resource_type: "video"
    });

    res.json({
      url: file.secure_url,
      format: file.format,
      duration: file.duration,
      size: file.bytes
    });
  } catch (error) {
    res.status(404).json({ message: "File not found" });
  }
});

router.post(
  "/upload-audio",
  uploadMedia.single("audio"),  // field name sent from frontend
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      return res.status(200).json({
        message: "Audio uploaded successfully",
        file: req.file
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export const deleteAudio = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: "video" // audio and video treated the same
  });
};

export default router;
