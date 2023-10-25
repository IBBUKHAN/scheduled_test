const fs = require("fs");
const wav = require("wav");

async function checkSampleRate(path) {
  const stream = fs.createReadStream(path);
  const reader = new wav.Reader();

  // Wait for the "format" event to get the sample rate
  const sampleRate = await new Promise((resolve, reject) => {
    reader.on("format", (format) => {
      resolve(format.sampleRate);
    });

    reader.on("error", (error) => {
      reject(error);
    });

    stream.pipe(reader);
  });

  return sampleRate;
}

// Example usage:
(async () => {
  try {
    const sampleRate = await checkSampleRate(
      "C:/Users/Ibbu/Downloads/bial.mp3"
    );
    console.log(`The sample rate of the audio file is ${sampleRate} Hz`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
