const express = require("express");
const router = express.Router();
const axios = require("axios");

const MURF_API_KEY = process.env.MURF_API_KEY;

// Endpoint to fetch available voices from Murf API
router.get("/api/murf-voices", async (req, res) => {
  try {
    const response = await axios.get("https://api.murf.ai/voices", {
      headers: {
        Authorization: `Bearer ${MURF_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Available Murf Voices:", JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching voices:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch voices" });
  }
});

// Voice selection map - VERIFIED MURF API VOICE IDs
const voiceMap = {
  // English voices (using US voices as provided)
  "male_en-IN":    { voice_id: "en-US-ken",        style: "Conversational" },
  "female_en-IN":  { voice_id: "en-US-natalie",    style: "Promo" },

  // Hindi voices (verified IDs)
  "male_hi-IN":    { voice_id: "hi-IN-rahul",      style: "General" },
  "female_hi-IN":  { voice_id: "hi-IN-shweta",     style: "Conversational" }
};

router.post("/api/murf-generate", async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text || !voiceId) {
    return res.status(400).json({ error: "Missing text or voiceId." });
  }
  try {
    const response = await axios.post(
      "https://api.murf.ai/v1/speech/generate",
      { text, voiceId },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "api-key": process.env.MURF_API_KEY
        }
      }
    );
    // The response contains a URL to the audio file
    res.json({ audioUrl: response.data.audioFile });
  } catch (err) {
    console.error("Murf API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Voice generation failed." });
  }
});

module.exports = router;
