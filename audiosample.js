const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffprobe = require("ffprobe-static");

const audioFilePath = "C:/Users/Ibbu/Downloads/boo.wav";

ffmpeg.setFfprobePath(ffprobe.path);
ffmpeg.ffprobe(audioFilePath, (err, metadata) => {
  if (err) {
    console.error("Error running ffprobe:", err);
    return;
  }

  if (metadata.streams && metadata.streams.length > 0) {
    const audioStream = metadata.streams.find(
      (stream) => stream.codec_type === "audio"
    );

    if (audioStream) {
      console.log(`Sample Rate: ${audioStream.sample_rate} Hz`);
      console.log(`Number of Channels: ${audioStream.channels}`);
    } else {
      console.log("Sample rate not found in metadata.");
    }
  }
});
