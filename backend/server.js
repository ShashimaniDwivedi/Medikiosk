require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pdfRoutes = require("./routes/pdfRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/pdf", pdfRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Node server is running",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
