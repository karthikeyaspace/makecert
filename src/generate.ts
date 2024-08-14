import { PDFDocument, StandardFonts, rgb, utf16Decode } from "pdf-lib";
import utils from "./utils";
import { Options } from "./types";
import path from "path";

const generate = async (options: Options) => {
  try {
    const {
      names,
      templatepath,
      outdir = "./certificates",
      x,
      y,
      color = { r: 0, g: 0, b: 0 },
      font,
      size = 30,
    } = options;

    const pdfDoc = await utils.loadPdf(templatepath);
    if (!pdfDoc) {
      throw new Error(
        "Failed to load pdf from path" + path.join(__dirname, templatepath)
      );
    }

    const { width, height } = pdfDoc.getPage(0).getSize();
    const embedFont = await utils.getFont(pdfDoc, font);

    const skippedNames = [];

    for (const name of names) {
      if (!utils.checkName(name)) {
        skippedNames.push(name);
        continue;
      }

      const pos = utils.calcpos(name, embedFont, size, width, height, x, y);
      if (!utils.checkSize(width, height, pos.x, pos.y)) {
        console.error(`Invalid position for text: ${name}`);
        skippedNames.push(name);
        continue;
      }

      const newpdf = await PDFDocument.create();
      const [page] = await newpdf.copyPages(pdfDoc, [0]);
      newpdf.addPage(page);

      const pdf = newpdf.getPage(0);

      pdf.drawText(name, {
        x: pos.x,
        y: pos.y,
        size,
        font: embedFont,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
      });

      const saveRes = await utils.savePdf(newpdf, outdir, name);

      saveRes
        ? console.log(`Generated ${name}.pdf`)
        : console.log(`Failed to generate ${name}.pdf`);
    }

    if (skippedNames.length > 0) {
      console.log("Skipped names: ", skippedNames);
      console.log(
        "Reasons for skipping: \n" +
          " - Name should be between 3 and 20 characters\n" +
          " - Positions x or y are invalid\n"
      );
    }
  } catch (e) {
    console.log("Error in generating certificate\n", e);
  }
};

export default generate;
