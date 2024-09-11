const { fromPath } = require("pdf2pic");
const { mkdirsSync, readdirSync } = require("fs-extra");
const rimraf = require("rimraf");
const path = require("path");

const convertPdfsToPngs = async () => {
  const inputDirectory = "./files";
  const outputDirectory = "./output/from-file-to-images";

  // Clear and recreate the output directory
  rimraf.sync(outputDirectory);
  mkdirsSync(outputDirectory);

  const baseOptions = {
    width: 2550,
    height: 3300,
    density: 330,
    savePath: outputDirectory,
    format: "png"
  };

  // Get all PDF files in the input directory
  const pdfFiles = readdirSync(inputDirectory).filter(file => file.toLowerCase().endsWith('.pdf'));

  // Process each PDF file
  for (const file of pdfFiles) {
    const inputPath = path.join(inputDirectory, file);
    const outputBaseName = path.basename(file, '.pdf');
    
    const convert = fromPath(inputPath, baseOptions);

    if (convert.bulk) {
      const results = await convert.bulk(-1, false);
      
      // Rename the files
      results.forEach((result, index) => {
        const oldPath = result.path;
        const newPath = path.join(outputDirectory, `${outputBaseName}.${index + 1}.png`);
        if (oldPath && oldPath !== newPath) {
          // Rename file if it exists and the name is different
          require('fs').renameSync(oldPath, newPath);
        }
      });
    }
  }
}

module.exports = { convertPdfsToPngs };