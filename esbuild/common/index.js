import fs from "fs-extra";
import { transformKeys } from "../utils/format.js";

const PUBLIC_DIR = "./public";

export async function prepareDistDirectory(distDir) {
  if (fs.existsSync(distDir)) {
    await fs.rm(distDir, { recursive: true });
  }

  await fs.copy(PUBLIC_DIR, distDir);
}

export function createClientEnvironment(envObj) {
  const clientEnvironment = transformKeys(envObj);

  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("CLIENT_") && process.env[key] !== undefined) {
      clientEnvironment[`process.env.${key}`] = `'${process.env[key]}'`;
    }
  });

  return clientEnvironment;
}
