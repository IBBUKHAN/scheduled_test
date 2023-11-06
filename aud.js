const axios = require("axios");
const fs = require("fs");
const lamejs = require("lamejs");
const Mp32Wav = require("mp3-to-wav");

async function convertMP3toWAV(mp3URL) {
  try {
    const mp3Response = await axios.get(mp3URL, {
      responseType: "arraybuffer",
    });
    const mp3Data = new Int8Array(mp3Response.data);

    const decoder = new Mp32Wav.Mp3Decoder();
    const pcmData = [];
    const chunkSize = 4096;

    for (let i = 0; i < mp3Data.length; i += chunkSize) {
      const end = Math.min(i + chunkSize, mp3Data.length);
      const chunk = mp3Data.subarray(i, end);
      const samples = decoder.decodeBuffer(chunk);
      if (samples.length > 0) {
        pcmData.push(samples);
      }
    }

    const audioData = [].concat(...pcmData);
    const wavFilePath = "output.wav";
    const wavData = new Int16Array(audioData);

    const buffer = new ArrayBuffer(wavData.length * 2);
    const view = new DataView(buffer);

    wavData.forEach((sample, index) => {
      view.setInt16(index * 2, sample, true);
    });

    fs.writeFileSync(wavFilePath, Buffer.from(buffer));

    return wavFilePath;
  } catch (error) {
    console.error("Conversion error:", error);
    return null;
  }
}
const mp3URL =
  "https://storage.corover.ai/chatbot-audio-bucket-aws/223ac7db-4e0d-4c3e-a342-5aec28776704.mp3";
convertMP3toWAV(mp3URL)
  .then((wavFilePath) => {
    console.log("WAV file:", wavFilePath);
  })
  .catch((error) => {
    console.error("Conversion error:", error);
  });
