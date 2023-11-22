const fs = require("fs-extra");

const DIST_DIR = "dist";
const PUBLIC_DIR = "./public";

async function prepareDistDirectory() {
  if (fs.existsSync(DIST_DIR)) {
    await fs.rm(DIST_DIR, { recursive: true });
  }
  await fs.copy(PUBLIC_DIR, DIST_DIR);
}

function createClientEnvironment(env) {
  const clientEnvironment = { "process.env.NODE_ENV": `'${env}'` };
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("CLIENT_")) {
      clientEnvironment[`process.env.${key}`] = `'${process.env[key]}'`;
    }
  });
  return clientEnvironment;
}

module.exports = {
  prepareDistDirectory,
  createClientEnvironment,
  DIST_DIR,
};
