# makecert

`makecert` is a typeScript-based npm package that allows you to generate custom certificates from a PDF template with ease. You can customize the text, font, color, and position on the certificate.

## Installation

You can install the package via npm:

```bash
npm i @karthikeyaspace/makecert
```
\
`Clone Github Repo`
```
git clone https://github.com/karthikeyaspace/makecert.git
```
`Install necessary Packages`

```
npm install
```

`Run Tests`
```
npm test
```
## Usage

You can use makecert to generate certificates with the following steps:

1.  Create a Template PDF: Prepare a PDF file with a layout where you want the names to appear.

2.  Configure and Generate Certificates: Use the generate function to create certificates with custom names and styles. 

## Example
Here's an example of how to use the makecert package:

```
import { generate } from "makecert";

const names = [
  "John Doe",
  "Jane Smith",
  "Alice Johnson",
];

async function main() {
  try {
    await generate({
      names,
      templatepath: "./path/to/template.pdf",
      outdir: "./certificates",
      color: { r: 139, g: 73, b: 33 },
      size: 45,
      x: 400,
      y: 305,
      font: "https://example.com/path/to/font.ttf" 
      // Optional: URL of the custom font
    });
  } catch (error) {
    console.error("Error during certificate generation:", error);
  }
}

main();

```


### Options
`names`: An array of names to be placed on the certificates.\
`templatepath`: Path to the PDF template file.\
`outdir`: Output directory where the generated certificates will be saved.\
`color`: RGB color object for the text.\
`size`: Font size for the text.\
`x`: X-coordinate for text position.\
`y`: Y-coordinate for text position.\
`font`: Optional URL to a custom font. If not provided, defaults to TimesRomanBoldItalic.

