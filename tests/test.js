const { generate } = require('makecert');

const names = [
  "Karthikeya",
  "Veruturi Sai Joshith Karthikeya",
  "Veruturi Karthikeya",
];

async function main() {
  try {
    generate({
      names,
      template: './tests/template.pdf',
      outdir: './cert',
      color: { r: 255, g: 215, b: 0 },
      // font: "https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf",
      size: 35,
    });
  } catch (error) {
    console.error("Error during certificate generation:", error);
  }
}

main();
