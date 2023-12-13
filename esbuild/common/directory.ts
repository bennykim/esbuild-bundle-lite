import { existsSync, rm, copy } from "fs-extra";

const PUBLIC_DIR = "./public";

export async function prepareDistDirectory(distDir: string): Promise<void> {
  if (existsSync(distDir)) {
    await rm(distDir, { recursive: true });
  }

  await copy(PUBLIC_DIR, distDir);
}
