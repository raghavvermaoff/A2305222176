import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { urls } from "./data.js";
import { Log } from "./logger.js";
import shortUrlRoutes from "./routes/shorturls.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Middleware → log every request
app.use(async (req, res, next) => {
  await Log("backend", "info", req.method, req.originalUrl);
  next();
});

// Redirect handler
app.get("/:code", async (req, res) => {
  const code = req.params.code;
  const data = urls[code];

  if (!data) {
    return res.status(404).json({ error: "Shortcode not found" });
  }
  if (new Date() > new Date(data.expiry)) {
    return res.status(410).json({ error: "Short link expired" });
  }

  data.clicks.push({
    timestamp: new Date(),
    referrer: req.get("referer") || "direct",
    location: "Unknown",
  });

  res.redirect(data.originalUrl);
});

// API routes
app.use("/shorturls", shortUrlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
