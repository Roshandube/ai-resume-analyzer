const fs = require("fs");
const pdf = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdf(dataBuffer);

    return data.text;
  } catch (error) {
    console.error("PDF ERROR:", error);
    throw error;
  }
};

module.exports = {
  extractTextFromPDF,
};
