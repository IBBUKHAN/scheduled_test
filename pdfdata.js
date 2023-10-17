const fs = require("fs");
const pdf = require("pdf-parse");

const pdfFilePath = "C:/Users/Ibbu/Downloads/sebipdf.pdf";
const outputFilePath = "output.txt";

function extractTextFromPDF(pdfFilePath, outputFilePath) {
  fs.readFile(pdfFilePath, (err, data) => {
    if (err) {
      console.error("Error reading PDF file:", err);
      return;
    }

    pdf(data).then((data) => {
      let text = data.text;

      // Detect bold text and underline it
      text = text.replace(/<b>(.*?)<\/b>/g, function (match, group) {
        return "\u001b[4m" + group + "\u001b[24m";
      });

      // Remove single alphabetical letters from the text
      text = text.replace(/(^|\n)[A-Z](\n|$)/g, "$1$2");

      // Remove page numbers (e.g., "1 2 3 ...") from the text
      text = text.replace(/\d+(\s\d+)*\s+/g, "");

      fs.writeFile(outputFilePath, text, (err) => {
        if (err) {
          console.error("Error writing to output file:", err);
        } else {
          console.log(`Text extracted from PDF and saved to ${outputFilePath}`);
        }
      });
    });
  });
}

extractTextFromPDF(pdfFilePath, outputFilePath);
