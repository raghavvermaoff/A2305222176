import express from "express";
import { nanoid } from "nanoid";
import validUrl from "valid-url";
import { urls } from "../data.js";
import { Log } from "../logger.js";

const router = express.Router();

// POST /shorturls → create short URL
router.post("/", async (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!validUrl.isWebUri(url)) {
    await Log("backend", "error", "createShort", "Invalid URL format");
    return res.status(400).json({ error: "Invalid URL" });
  }

  let code = shortcode || nanoid(6);
  if (urls[code]) {
    return res.status(409).json({ error: "Shortcode already exists" });
  }

  const minutes = validity && Number.isInteger(validity) ? validity : 30;
  const expiry = new Date(Date.now() + minutes * 60000);

  urls[code] = {
    originalUrl: url,
    expiry,
    createdAt: new Date(),
    clicks: [],
  };

  await Log("backend", "info", "createShort", `Short URL created: ${code}`);

  res.status(201).json({
    shortLink: `http://localhost:5000/${code}`,
    expiry: expiry.toISOString(),
  });
});

// GET /shorturls/:code → get stats
router.get("/:code", async (req, res) => {
  const code = req.params.code;
  const data = urls[code];

  if (!data) {
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json({
    totalClicks: data.clicks.length,
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiry: data.expiry,
    clicks: data.clicks,
  });
});

export default router;
