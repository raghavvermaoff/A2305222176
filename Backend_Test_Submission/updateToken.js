import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load pre-setup .env
dotenv.config({ path: "../affordmed-pre-setup/.env" });

// Build request body from pre-setup .env + hardcoded fields
const body = {
  email: process.env.EMAIL,
  name: process.env.NAME,
  mobileNo: "9319716046", // hardcoded
  githubUsername: "raghavvermaoff", // hardcoded
  rollNo: process.env.ROLL_NO,
  accessCode: process.env.ACCESS_CODE,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

async function getToken() {
  try {
    const res = await fetch(
      "http://20.244.56.144/evaluation-service/register",
      {
        // ⬅ replace with the same URL you use in register.js
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!data.access_token) {
      console.error("❌ Failed to get token:", data);
      return;
    }

    console.log("✅ Got new token:", data.access_token);

    // Save token to backend .env
    fs.writeFileSync(".env", `ACCESS_TOKEN=${data.access_token}\nPORT=5000\n`);
    console.log("✅ Backend .env updated with fresh token");
  } catch (err) {
    console.error("❌ Error fetching token:", err);
  }
}

getToken();
