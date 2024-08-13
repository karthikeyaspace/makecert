import { StandardFonts } from "pdf-lib";
export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Options {
  names: string[];
  template: string;
  outdir?: string;
  x?: number;
  y?: number;
  color?: Color;
  font: string; 
  size?: number;
}
