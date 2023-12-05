import fs from "fs-extra";

export const DIST_DIR = "dist";
const PUBLIC_DIR = "./public";

export async function prepareDistDirectory() {
  if (fs.existsSync(DIST_DIR)) {
    await fs.rm(DIST_DIR, { recursive: true });
  }
  await fs.copy(PUBLIC_DIR, DIST_DIR);
}

export function createClientEnvironment(env) {
  const clientEnvironment = { "process.env.NODE_ENV": `'${env}'` };
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("CLIENT_")) {
      clientEnvironment[`process.env.${key}`] = `'${process.env[key]}'`;
    }
  });
  return clientEnvironment;
}
