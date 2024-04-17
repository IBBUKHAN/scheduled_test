const fs = require("fs");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");

// Path to your XLSX file
const xlsxFilePath = "main_data_v1.xlsx";

// Path where you want to save the PDF file
const pdfFilePath = "output.pdf";

// Path where you want to save the JSON file
const jsonFilePath = "output.json";

// Function to convert XLSX to JSON
function convertXlsxToJson(xlsxFilePath) {
  const workbook = XLSX.readFile(xlsxFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

// Function to convert JSON to PDF
function convertJsonToPdf(jsonData, pdfFilePath) {
  const doc = new PDFDocument();
  const outputStream = fs.createWriteStream(pdfFilePath);

  doc.pipe(outputStream);

  const columnWidths = calculateColumnWidths(jsonData);

  const header = Object.keys(jsonData[0]);
  header.forEach((key, index) => {
    doc.text(key, columnWidths[index].x, 50);
  });

  doc.font("Helvetica").fontSize(10);
  let y = 70;
  jsonData.forEach((row) => {
    let x = 80;
    Object.values(row).forEach((value, index) => {
      doc.text(value.toString(), columnWidths[index].x, y);
      x += columnWidths[index].width;
    });
    y += 20;
  });

  doc.end();
  console.log("PDF created successfully");
}

// Function to calculate column widths based on data
function calculateColumnWidths(data) {
  const columnWidths = [];
  const header = Object.keys(data[0]);
  header.forEach((key, index) => {
    const values = data.map((row) => row[key]);
    const maxLength = Math.max(
      ...values.map((value) => value.toString().length)
    );
    columnWidths.push({
      x: 50 + index * 150,
      width: Math.max(maxLength * 7, 50),
    });
  });
  return columnWidths;
}

// Call the function to convert XLSX to JSON
const jsonData = convertXlsxToJson(xlsxFilePath);

// Call the function to convert JSON to PDF
convertJsonToPdf(jsonData, pdfFilePath);

// Save JSON file
fs.writeFile(jsonFilePath, JSON.stringify(jsonData), (err) => {
  if (err) {
    console.error("Error occurred while saving JSON file:", err.message);
  } else {
    console.log("JSON file saved successfully");
  }
});
