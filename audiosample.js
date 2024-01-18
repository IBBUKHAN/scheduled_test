const axios = require("axios");
const fs = require("fs");

const apiUrl =
  "https://api.elevenlabs.io/v1/text-to-speech/XrExE9yKIg1WjnnlVkGX";

const headers = {
  "Content-Type": "application/json",
  "xi-api-key": "2f11d41239d71d4b24a56ad2d471cd2f",
};

const data = {
  model_id: "eleven_multilingual_v2",
  text: "Vicky aur uske friends ne ek chat group banaaya jisme wo memes, school ke notes aur yaha wahan ki baatein share karte the.",
  voice_settings: {
    similarity_boost: 0.75,
    stability: 0.5,
    use_speaker_boost: true,
    style: 0,
  },
};

axios
  .post(apiUrl, data, { headers, responseType: "arraybuffer" })
  .then((response) => {
    const audioBuffer = Buffer.from(response.data);
    const filePath = "response.mp3";
    fs.writeFileSync(filePath, audioBuffer);
    console.log(`Audio response saved to ${filePath}`);
  })
  .catch((error) => {
    console.error("Error:", error.message || error);
  });
