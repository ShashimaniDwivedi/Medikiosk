const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================================================
// MULTER STORAGE
// =====================================================

// Store uploaded file in memory

const storage = multer.memoryStorage();

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({
  storage: storage,

  limits: {
    // Maximum 10 MB
    fileSize: 10 * 1024 * 1024,
  },

  // ===================================================
  // FILE FILTER
  // ===================================================

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, JPEG and PNG files are allowed."));
    }
  },
});

// =====================================================
// UPLOAD PDF / IMAGE
// =====================================================

router.post(
  "/upload",

  // IMPORTANT:
  // Must match Review.jsx
  // formData.append("file", ...)

  upload.single("file"),

  async (req, res) => {
    try {
      // =================================================
      // CHECK FILE
      // =================================================

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded.",
        });
      }

      console.log("Received file:", req.file.originalname);

      console.log("File type:", req.file.mimetype);

      // =================================================
      // DETERMINE FILE TYPE
      // =================================================

      const isPdf = req.file.mimetype === "application/pdf";

      const resourceType = isPdf ? "raw" : "image";

      // =================================================
      // UPLOAD TO CLOUDINARY
      // =================================================

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "medikiosk/reports",

            resource_type: resourceType,

            use_filename: true,

            unique_filename: true,

            overwrite: false,
          },

          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        // Send file buffer
        // to Cloudinary

        stream.end(req.file.buffer);
      });

      // =================================================
      // SUCCESS RESPONSE
      // =================================================

      console.log("Cloudinary upload successful:");

      console.log(uploadResult.secure_url);

      return res.status(200).json({
        message: "File uploaded successfully.",

        url: uploadResult.secure_url,

        public_id: uploadResult.public_id,

        resource_type: uploadResult.resource_type,

        format: uploadResult.format,
      });
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);

      return res.status(500).json({
        message: error.message || "File upload failed.",
      });
    }
  },
);

// =====================================================
// MULTER / FILE ERROR HANDLER
// =====================================================

router.use((error, req, res, next) => {
  // File size error

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File must be less than 10 MB.",
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }

  // Custom file type error

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  next();
});

module.exports = router;
