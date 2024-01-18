const axios = require("axios");
const Bottleneck = require("bottleneck");

const apiKey = "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";

// Create a limiter to control the rate of requests
const limiter = new Bottleneck({
  maxConcurrent: 1, // Adjust as needed
  minTime: 1000, // Adjust as needed (milliseconds)
});

async function generateText(prompt) {
  try {
    const response = await limiter.schedule(() =>
      axios.post(
        "https://api.openai.com/v1/engines/davinci/completions",
        {
          prompt: prompt,
          max_tokens: 100,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      )
    );

    const generatedText = response.data.choices[0].text.trim();
    console.log(generatedText);
  } catch (error) {
    console.error("Error generating text:", error.message);
  }
}

// Example usage
const promptWord = "hello";
generateText(`Generate text starting with the word "${promptWord}"`);
