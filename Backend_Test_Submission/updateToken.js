import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config({ path: "../affordmed-pre-setup/.env" });

const body = {
  email: process.env.EMAIL,
  name: process.env.NAME,
  rollNo: process.env.ROLL_NO,
  accessCode: process.env.ACCESS_CODE,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

async function getToken() {
  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      console.log("✅ Got token:", data.access_token);

      // If you want, save it to your backend .env automatically
      // (so you don't have to copy manually every time)
      import("fs").then((fs) => {
        fs.writeFileSync(".env", `ACCESS_TOKEN=${data.access_token}\n`, {
          flag: "w",
        });
        console.log("🔹 Token saved to backend .env");
      });
    } else {
      console.error("❌ Failed to get token:", data);
    }
  } catch (err) {
    console.error("❌ Error fetching token:", err.message);
  }
}

getToken();
