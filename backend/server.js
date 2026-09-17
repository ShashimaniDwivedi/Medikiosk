require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pdfRoutes = require("./routes/pdfRoutes");

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
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
