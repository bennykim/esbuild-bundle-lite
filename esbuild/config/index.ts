import type { BuildOptions } from "esbuild";

export interface CustomOptions extends BuildOptions {
  entry: string[];
  distDir: string;
  port: number;
  env: Record<string, string>;
}

export const config: CustomOptions = {
  entry: ["src/index.tsx"],
  distDir: "dist",
  outfile: "bundle.js",
  port: 3000,
  env: {},
  loader: { ".png": "file", ".svg": "file" },
};
