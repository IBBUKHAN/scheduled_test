const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);
const inputFilePath =
  "https://storage.corover.ai/chatbot-audio-bucket-aws/72377124-3003-42cb-8c6c-317c04e02ea9.mp3";

const outputFilePath = "C:/Users/Ibbu/Downloads/ibbu.wav";

ffmpeg()
  .input(inputFilePath)
  .audioCodec("pcm_s16le")
  .toFormat("wav")
  .on("end", () => {
    console.log("===>", inputFilePath);
    console.log("Conversion finished");
  })
  .on("error", (err) => {
    console.error("Error:", err);
  })
  .save(outputFilePath);
