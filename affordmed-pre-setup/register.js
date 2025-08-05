(async () => {
  const fetch = (await import("node-fetch")).default;

  const url = "http://20.244.56.144/evaluation-service/register";

  const body = {
    email: "raghav.verma1@s.amity.edu",
    name: "Raghav Verma",
    mobileNo: "9319716046",
    githubUsername: "raghavvermaoff",
    rollNo: "A2305222176",
    accessCode: "yvhdda",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("Registration Response:", data);
    console.log(
      "\n⚠️ Save your clientID and clientSecret — they will not be shown again!"
    );
  } catch (error) {
    console.error("Error during registration:", error);
  }
})();
