const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

// Set the path to the FFmpeg binary
ffmpeg.setFfmpegPath(ffmpegPath);

// Input MP3 file path
const inputFilePath =
  "https://storage.corover.ai/chatbot-audio-bucket-aws/b3828fd0-9fc8-4bdc-b303-87bd54886bd9.mp3";

// Output WAV file path
const outputFilePath = "new.wav";

ffmpeg()
  .input(inputFilePath)
  .audioCodec("pcm_s16le")
  .toFormat("wav")
  .on("end", () => {
    console.log("Conversion finished");
  })
  .on("error", (err) => {
    console.error("Error:", err);
  })
  .save(outputFilePath);
