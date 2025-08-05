import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState(30);
  const [shortLink, setShortLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortLink("");

    try {
      const res = await fetch("http://localhost:5000/shorturls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ url, validity: Number(validity) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setShortLink(data.shortLink);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortLink);
    alert("Copied to clipboard!");
  };

  return (
    <div className="app-container">
      <h1>🔗 URL Shortener</h1>
      <form className="url-form" onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter a URL to shorten"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Validity (mins)"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          min="1"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {shortLink && (
        <div className="result">
          <p>Your short link:</p>
          <a href={shortLink} target="_blank" rel="noreferrer">
            {shortLink}
          </a>
          <button onClick={copyToClipboard}>📋 Copy</button>
        </div>
      )}
    </div>
  );
}

export default App;
