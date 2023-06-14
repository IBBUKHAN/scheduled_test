const fs = require('fs');
const PDFParser = require('pdf-parse');
const axios = require('axios');

const OPENAI_API_KEY = ''; // Replace with your OpenAI API key
const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';
const SAMPLE_PDF_FILE = 'khan.pdf'; // Path to your sample PDF file

const QUERY = `
Want to extract information about "Harishena composed a prashasti in praise of Gautamiputra Shri Satakarni.".
Return the results in JSON format without any explanation.
The text related to "Harishena composed a prashasti in praise of Gautamiputra Shri Satakarni." is as follows:
%s
`;

async function extractPDFContent(pdfPath) {
  const pdfData = fs.readFileSync(pdfPath);
  const pdf = await PDFParser(pdfData);
  return pdf.text;
}

async function callOpenAIAPI(pdfText) {
  const requestBody = {
    prompt: QUERY.replace('%s', pdfText),
    temperature: 0.5,
    max_tokens: 2048,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  };

  const response = await axios.post(OPENAI_API_URL, requestBody, config);
  return response.data.choices[0].text;
}

function extractAnswer(apiResponse) {
  try {
    const answer = JSON.parse(apiResponse);
    return answer;
  } catch (error) {
    return {};
  }
}

async function main() {
  try {
    const pdfPath = `C:/Users/Ibbu/Downloads/khan.pdf`;
    const pdfText = await extractPDFContent(pdfPath);
    const apiResponse = await callOpenAIAPI(pdfText);
    const results = extractAnswer(apiResponse);
    console.log(results);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
