import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

export const loadPdf = async (tpath: string) => {
  try {
    const pdfBytes = fs.readFileSync(tpath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc;
  } catch (err) {
    return null;
  }
};

export const savePdf = async (
  pdfDoc: PDFDocument,
  outdir: string,
  name: string
) => {
  try {
    const pdfBytes = await pdfDoc.save();
    const outputdir = path.join(outdir, `${name}.pdf`);
    if (!fs.existsSync(outputdir)) fs.mkdirSync(outdir, { recursive: true });
    fs.writeFileSync(outputdir, pdfBytes);
    return { status: true };
  } catch (err) {
    console.log(err);
    return { status: false };
  }
};

export const checkName = (name: string) => {
  if (!name || name === "" || name.length < 3 || name.length > 100)
    return {
      status: false,
    };
  return { status: true };
};

export const checkSize = (
  width: number,
  height: number,
  x: number,
  y: number
) => {
  if (x === undefined || y === undefined) return { status: true };
  if (x < 0 || x > width || y < 0 || y > height)
    return {
      status: false,
    };
  return { status: true };
};

export const getFontFromUrl = async (url: string) => {
  try {
    const fontBytes = await fetch(url).then(res => res.arrayBuffer())
    return fontBytes;
  } catch (err) {
    console.error('Error fetching Google Font');
    return null;
  }
};
