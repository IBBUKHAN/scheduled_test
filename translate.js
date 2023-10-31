const axios = require("axios");
const fs = require("fs");
const json = require("./translate.json");

async function translationFn(text) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.googleapis.com/language/translate/v2?key=AIzaSyCAPKjw4U8MgkXrcXh1xEuogF3TQopKyac&source=hi&target=en&q=${encodeURIComponent(
          text
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
  const translatedQuestions = [];

  for (let i = 0; i < json.length; i++) {
    const question = json[i].Question;

    const translatedText = await translationFn(question);
    const translatedQuestion = {
      Question: question,
      Translate: translatedText,
    };
    console.log("TranslatedValue", translatedQuestion);
    translatedQuestions.push(translatedQuestion);
  }

  // Write the translated questions to output.json
  fs.writeFileSync("output.json", JSON.stringify(translatedQuestions, null, 2));
}

main();
