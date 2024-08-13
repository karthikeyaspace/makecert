import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as utils from "./utils";
import { Options } from "./types";
import path from "path";
import fontkit from "@pdf-lib/fontkit";


const generate = async (options: Options) => {
  try {
    let { names, template, outdir, x, y, color, font, size } = options;

    const pdfDoc = await utils.loadPdf(template);
    if (!pdfDoc) {
      console.log(
        "Failed to load pdf from path" + path.join(__dirname, template)
      );
      return;
    }

    const { width, height } = pdfDoc.getPage(0).getSize();
    if (!outdir) outdir = "./certificates";
    if (!color) color = { r: 0, g: 0, b: 0 };
    if (!size) size = 30;

    let embedFont;
    if (font) {
      const pdfBytes = await utils.getFontFromUrl(font);
      if (pdfBytes) {
        pdfDoc.registerFontkit(fontkit);
        embedFont = await pdfDoc.embedFont(pdfBytes);
      }
      else {
        console.warn(
          `Failed to load Google Font "${font}". Default font: TimesRoman`
        );
        embedFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
      }
    } else {
      embedFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    }
    if (embedFont === null) throw new Error("Invalid Font");

    let skippedNames = [];

    for (const name of names) {
      if (!utils.checkName(name).status) {
        skippedNames.push(name);
        continue;
      }

      console.log(name.length, "name.length");
      const textWidth = embedFont.widthOfTextAtSize(name, size);
      console.log(textWidth, "textWidth");
      x=undefined;
      y=undefined;
      if (x === undefined) x = (width - textWidth) / 2;
      if (y === undefined) y = height / 2;
      console.log(x, y, "x, y");
      if (!utils.checkSize(width, height, x, y).status) {
        console.error(`Invalid position for text: ${name}`);
        skippedNames.push(name);
        continue;
      }

      const newpdf = await PDFDocument.create();
      const [page] = await newpdf.copyPages(pdfDoc, [0]);
      newpdf.addPage(page);

      const pdf = newpdf.getPage(0);
      
      pdf.drawText(name, {
        x,
        y,
        size,
        font: embedFont,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
      });

      const saveRes = await utils.savePdf(newpdf, outdir, name);

      if (saveRes.status) console.log(`Generated ${name}.pdf`);
      else console.log(`Failed to generate ${name}.pdf`);
    }

    if (skippedNames.length > 0) {
      console.log("Skipped names: ", skippedNames);
      console.log(
        "Reasons for skipping: \n" +
          " - Name should be between 3 and 20 characters\n"
      );
    }
  } catch (e) {
    console.log("Error in generating certificate\n", e);
  }
};

export default generate;
