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

// Redirect handler (NO token needed)
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

  await Log("backend", "info", "redirect", `Redirected to ${data.originalUrl}`);
  res.redirect(data.originalUrl);
});

// Auth middleware (only for /shorturls routes)
app.use(async (req, res, next) => {
  if (!req.path.startsWith("/shorturls")) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    await Log(
      "backend",
      "error",
      "auth",
      "missing or invalid authorization header"
    );
    return res.status(401).json({ message: "invalid authorization token" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== process.env.ACCESS_TOKEN) {
    await Log("backend", "error", "auth", "token mismatch");
    return res.status(401).json({ message: "invalid authorization token" });
  }

  await Log("backend", "info", req.method, req.originalUrl);
  next();
});

// API routes
app.use("/shorturls", shortUrlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
