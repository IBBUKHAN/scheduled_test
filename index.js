const axios = require("axios");
const fs = require("fs");
const json = require("./digisaathiaudio.json");

async function translationFn(query, language) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.googleapis.com/language/translate/v2?key=YOUR_API_KEY&source=${language}&target=en&q=${encodeURIComponent(
          query
        )}`
      )
      .then(function (response) {
        resolve(response.data.data.translations[0].translatedText);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
}

async function main() {
  const output = [];

  for (let i = 0; i < json.length; i++) {
    const query = json[i].Answer_EN;
    const language = "en";

    const result = await translationFn(query, language);
    if (result) {
      output.push({
        input: query,
        output: result,
      });
    }
  }

  fs.writeFileSync("output.json", JSON.stringify(output));
}

main();
