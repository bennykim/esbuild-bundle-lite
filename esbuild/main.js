import { serve } from "./serve.js";
import { build } from "./build.js";

const DEVELOPMENT = "development";
const PRODUCTION = "production";
const SERVE_COMMAND = "--serve";
const BUILD_COMMAND = "--build";

export const defaultConfig = {
  entry: ["src/index.tsx"],
  distDir: "dist",
  outfile: "bundle.js",
  port: 3000,
  env: {},
  loader: { ".png": "file", ".svg": "file" },
};

function executeCommand() {
  const args = process.argv;

  if (args.includes(SERVE_COMMAND)) {
    defaultConfig.env["nodeEnv"] = DEVELOPMENT;
    serve(defaultConfig);
  }

  if (args.includes(BUILD_COMMAND)) {
    defaultConfig.env["nodeEnv"] = PRODUCTION;
    build(defaultConfig);
  }
}

executeCommand();
