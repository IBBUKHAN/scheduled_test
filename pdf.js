const ExcelJS = require("exceljs");
const PDF = require("pdfkit");
const fs = require("fs");

(async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("main_data_v1.xlsx");
    const worksheet = workbook.getWorksheet("Sheet1");

    const pdfDoc = new PDF();
    pdfDoc.pipe(fs.createWriteStream("file1.pdf"));

    const columnSpacing = 80;
    const rowHeight = 40;

    worksheet.eachRow((row, rowIndex) => {
      row.eachCell((cell, colIndex) => {
        const xPos = colIndex * columnSpacing;
        const yPos = rowIndex * rowHeight;
        pdfDoc.text(cell.text, xPos, yPos, { width: columnSpacing });
      });
    });

    pdfDoc.end();
    console.log("PDF generation completed.");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
})();
