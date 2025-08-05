import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

export async function Log(stack, level, pkg, message) {
  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    const data = await res.json();
    console.log("✅ Log sent:", data);
  } catch (err) {
    console.error("❌ Logging failed:", err.message);
  }
}
