require("dotenv").config();
const OpenAI = require("openai");

// Initialize the OpenAI API client with your API key
const openai = new OpenAI({
  apiKey:
    "sk-LEuGqiGJqsD-ez2_n4dKeyQKqRs0gUL2wCJrrBDQtFT3BlbkFJgBGoccAfhf9v6o0oZTfsh9TXKsq5-J-XuCFbYCbzIA",
});

// Function to rephrase text using OpenAI
async function rephraseText(text, retries = 3) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that rephrases text.",
        },
        {
          role: "user",
          content: `Please rephrase the following text: ${text}`,
        },
      ],
    });

    const rephrasedText = response.choices[0].message.content.trim();
    return rephrasedText;
  } catch (error) {
    if (error.code === "insufficient_quota" && retries > 0) {
      console.warn("Rate limit hit. Retrying in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds
      return rephraseText(text, retries - 1); // retry with one less retry
    } else {
      console.error("Error while rephrasing text:", error.message);
      throw error;
    }
  }
}

// Example usage
(async () => {
  const originalText =
    "This is an example sentence that needs to be rephrased.";
  const rephrased = await rephraseText(originalText);
  console.log("Original Text:", originalText);
  console.log("Rephrased Text:", rephrased);
})();
