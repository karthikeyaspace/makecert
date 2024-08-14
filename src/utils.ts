import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit";

const loadPdf = async (tpath: string) => {
  try {
    const pdfBytes = fs.readFileSync(tpath);
    return await PDFDocument.load(pdfBytes);
  } catch (err) {
    return null;
  }
};

const savePdf = async (pdfDoc: PDFDocument, outdir: string, name: string) => {
  try {
    const pdfBytes = await pdfDoc.save();
    const outputdir = path.join(outdir, `${name}.pdf`);
    if (!fs.existsSync(outputdir)) fs.mkdirSync(outdir, { recursive: true });
    fs.writeFileSync(outputdir, pdfBytes);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const checkName = (name: string) => {
  return name && name.length > 3 && name.length < 30;
};

const checkSize = (width: number, height: number, x: number, y: number) => {
  return x >= 0 && x <= width && y >= 0 && y <= height;
};

const calcpos = (
  name: string,
  embedFont: any,
  size: number,
  width: number,
  height: number,
  x?: number,
  y?: number
) => {
  const textWidth = embedFont.widthOfTextAtSize(name, size);
  return {
    x: x !== undefined ? x - textWidth / 2 : (width - textWidth) / 2,
    y: y !== undefined ? height - y : height / 2,
  };
};

const getFont = async (pdfDoc: PDFDocument, font?: string) => {
  if (font) {
    const fontBytes = await fetch(font).then((res) => res.arrayBuffer());
    if (fontBytes) {
      pdfDoc.registerFontkit(fontkit);
      return await pdfDoc.embedFont(fontBytes);
    }
    console.log("Failed to load custom font, using default font");
  }
  return await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
};

export default {
  loadPdf,
  savePdf,
  checkName,
  checkSize,
  calcpos,
  getFont,
};
