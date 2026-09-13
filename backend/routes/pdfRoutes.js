const express = require("express");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

/* =========================
   MULTER CONFIGURATION
========================= */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

/* =========================
   PDF UPLOAD
========================= */

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    // Check if PDF exists
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required",
      });
    }

    // Get original file name
    const originalName = path.parse(req.file.originalname).name;

    // Make filename Cloudinary-safe
    const safeFileName = originalName
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    // Unique PDF public ID
    const publicId = `${safeFileName}-${Date.now()}.pdf`;

    /* =========================
       CLOUDINARY UPLOAD
    ========================= */

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          type: "upload",
          folder: "medical-reports",
          public_id: publicId,
        },

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      // Send PDF buffer to Cloudinary
      stream.end(req.file.buffer);
    });

    /* =========================
       SUCCESS RESPONSE
    ========================= */

    return res.status(200).json({
      message: "PDF uploaded successfully",

      // Cloudinary URL
      url: result.secure_url,

      // Cloudinary public ID
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return res.status(500).json({
      message: "PDF upload failed",
      error: error.message,
    });
  }
});

/* =========================
   ERROR HANDLING
========================= */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "PDF size must be less than 10 MB",
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  next();
});

module.exports = router;
