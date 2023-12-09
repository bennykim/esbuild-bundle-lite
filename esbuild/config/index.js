export const config = {
  entry: ["src/index.tsx"],
  distDir: "dist",
  outfile: "bundle.js",
  port: 3000,
  env: {},
  loader: { ".png": "file", ".svg": "file" },
};
