const { generate } = require("makecert");

const names = [
  "Lorem Ipsum",
  "Lorem Ipsum Dolor",
  "Lorem Ipsum Dolor Sit Amet",
];

async function main() {
  try {
    generate({
      names,
      templatepath: "./tests/template.pdf",
      outdir: "./certs",
      color: { r: 139, g: 73, b: 33 },
      size: 45,
      x: 400,
      y: 305,
    });
  } catch (error) {
    console.error("Error during certificate generation:", error);
  }
}

main();

// 162, 153
