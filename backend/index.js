const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 8080;
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API, // Replace with a secure storage method
});

app.use(cors());

let previousJokes = new Set(); // Store previous jokes to avoid repetition

const arr = [
  "Generate a dark, flirtatious remark that feels like a villainous love confession—something sharp, dangerously romantic, and irresistibly wicked.",
  "Give me a flirty joke that is equal parts sweet and mischievous, like a stolen glance across a candlelit table.",
  "Create a short, poetic flirtation that sounds like it was written by a brooding literary genius with a taste for romance and mystery.",
  "Craft a witty, seductive one-liner that has the charm of a rogue in a noir film—dark, smooth, and dangerously enchanting.",
  "Write a flirtatious joke that teases with a touch of melancholy, as if love and tragedy are two sides of the same coin.",
  "Give me a flirty line that feels like the opening scene of a forbidden romance—mysterious, electrifying, and full of tension.",
  "Generate a playful and slightly twisted flirtation that feels like an inside joke between two charming troublemakers.",
  "Create a romantic joke that feels like a confession whispered under a midnight sky, full of longing and mischief.",
  "Write a flirtatious remark that has the same energy as a cat-and-mouse game between two lovers who know they’re meant for each other.",
  "Give me a dark, sarcastic, and flirty joke that sounds like it came from a charming villain with a heart of gold.",
  "Create a deeply poetic and soulful flirtation—something that would make even the coldest heart melt.",
  "Generate a mischievous and teasing flirtation that sounds like it belongs in a modern love story full of twists and turns.",
  "Write a flirty one-liner that blends wit, danger, and romance—something you’d hear in an old Hollywood film.",
  "Give me a flirty remark that has a gothic, slightly eerie but irresistibly enchanting vibe—like a love letter written in candlelight.",
  "Create a flirtatious line that feels like a secret between two lovers—a mix of mischief, passion, and undeniable chemistry.",
  "Write a short but devastatingly romantic flirtation—something so sweet it almost hurts.",
  "Give me a flirty joke that has an unexpected, almost haunting twist—something that lingers in the mind long after it's heard.",
  "Generate a bittersweet, poetic flirtation—something that acknowledges the beauty in love’s fleeting nature.",
  "Create a flirtatious remark that blends arrogance and charm, as if it were spoken by a dangerously confident heartbreaker.",
  "Write a playful, over-the-top romantic confession that feels like something from a dramatic love story—bold, passionate, and impossible to ignore.",
];

// Function to pick a random prompt from the array
function getRandomPrompt() {
  return arr[Math.floor(Math.random() * arr.length)];
}

app.get("/", async (req, res) => {
  try {
    let joke = "";

    for (let i = 0; i < 3; i++) {
      const prompt = getRandomPrompt(); // Pick a new random prompt each time
      console.log("Using prompt:", prompt);

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: ` ${prompt} 
              Listen! Give me a UNIQUE, fresh, and bold flirty joke in English.

The joke should be dark, witty, and slightly twisted, but still playful.
Use simple and natural words—nothing too fancy or complicated.

It should feel modern, edgy, and something a girl would enjoy.

Never repeat a joke—each one must be completely new and different from the previous ones.

Keep it short (one or two lines only) and make sure it's clever and impactful.

The joke should have a flirty and mysterious tone, not just basic pickup lines.

Every time, generate a brand-new dark flirty joke that hasn't been used before!`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 1.2, // Increase randomness further
          top_p: 0.8, // Reduce common joke patterns
          top_k: 50, // Further diversify responses
          max_output_tokens: 60, // Ensure joke is short
        },
      });

      joke =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No joke found!";

      // Check if joke is already generated before
      if (!previousJokes.has(joke)) {
        previousJokes.add(joke);
        break;
      }
    }

    // Keep only last 10 jokes to avoid memory overload
    if (previousJokes.size > 10) {
      previousJokes = new Set(Array.from(previousJokes).slice(-10));
    }

    res.send(joke);
  } catch (error) {
    console.error("Error fetching joke:", error);
    res.status(500).send("Error generating joke!");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
