require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pdfRoutes = require("./routes/pdfRoutes");

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://medikiosk-a5yn.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// =====================================================
// JSON
// =====================================================

app.use(express.json());

// =====================================================
// PDF / IMAGE ROUTES
// =====================================================

app.use("/api/pdf", pdfRoutes);

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Node server is running",
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
