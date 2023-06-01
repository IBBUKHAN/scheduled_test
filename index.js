const axios = require("axios");
const fs = require("fs");
const json = require("./lic_branch.json");

async function translationFn(text) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.googleapis.com/language/translate/v2?key=AIzaSyCAPKjw4U8MgkXrcXh1xEuogF3TQopKyac&source=en&target=hi&q=${encodeURIComponent(
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
  const output = [];

  for (let i = 0; i < json.length; i++) {
    const data = json[i];
    const translatedData = {
      branch_code: data.branch_code,
      branch_name: await translationFn(data.branch_name),
      address_1: await translationFn(data.address_1),
      address_2: await translationFn(data.address_2),
      address_3: await translationFn(data.address_3),
      city:  await translationFn(data.city),
      state: await translationFn(data.state),
      pin: data.pin,
      division_name: await translationFn(data.division_name),
      id: data.id
    };

    console.log(translatedData);
    output.push(translatedData);
  }

  fs.writeFileSync("output.json", JSON.stringify(output));
}

main();





