(async () => {
  const fetch = (await import("node-fetch")).default;

  const url = "http://20.244.56.144/evaluation-service/auth";

  const body = {
    email: "raghav.verma1@s.amity.edu",
    name: "Raghav Verma",
    rollNo: "A2305222176",
    accessCode: "yvhdda",
    clientID: "262cf490-43b3-4237-a852-f158823b192f",
    clientSecret: "esZDYMydkHQnJrWw",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("Auth Response:", data);
    console.log(
      "\n⚠️ Save your access_token — you'll need it for the logging middleware."
    );
  } catch (error) {
    console.error("Error during auth:", error);
  }
})();
