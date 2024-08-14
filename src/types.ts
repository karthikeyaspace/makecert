export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Options {
  names: string[];
  templatepath: string;
  outdir?: string;
  x?: number;
  y?: number;
  color?: Color;
  font: string; 
  size?: number;
}
