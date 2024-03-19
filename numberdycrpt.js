var CryptoJS = require("crypto-js");

// Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();

// Decrypt
var bytes = CryptoJS.AES.decrypt(
  "U2FsdGVkX18PPQ7h1vs9DIiq/dvIEPY0w6+W1QqRSNo=",
  "yC7N9P3idg05oJV7"
);
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText); // 'my message'
