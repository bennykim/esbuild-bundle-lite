const esbuild = require("esbuild");
const { config } = require("dotenv");
const fs = require("fs-extra");
const aliasConfig = require("./plugins/aliasConfig");

const runBuild = async () => {
  config();
  await prepareDistDirectory();
  const clientEnv = createClientEnvironment("production");
  await buildClientBundle(clientEnv);
};

const prepareDistDirectory = async () => {
  const distDir = "dist";
  const publicDir = "./public";
  if (fs.existsSync(distDir)) {
    await fs.rm(distDir, { recursive: true });
  }
  await fs.copy(publicDir, distDir);
};

const createClientEnvironment = (env) => {
  const clientEnv = { "process.env.NODE_ENV": `'${env}'` };
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("CLIENT_")) {
      clientEnv[`process.env.${key}`] = `'${process.env[key]}'`;
    }
  });
  return clientEnv;
};

const buildClientBundle = async (clientEnv) => {
  await esbuild
    .build({
      entryPoints: ["src/index.tsx"],
      bundle: true,
      minify: true,
      define: clientEnv,
      loader: { ".png": "file", ".svg": "file" },
      plugins: [aliasConfig],
      outfile: "dist/bundle.js",
    })
    .then((result) => {
      console.log("Build successful", result);
    })
    .catch(() => {
      process.exit(1);
    });
};

runBuild();
