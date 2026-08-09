import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import documentRoutes from "../src/routes/documents.routes.js"

dotenv.config({quiet:false});

const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 5000;

app.use("/api/documents",documentRoutes)

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CollabSpace backend is healthy",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
