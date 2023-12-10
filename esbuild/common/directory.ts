import fs from "fs-extra";

const PUBLIC_DIR = "./public";

export async function prepareDistDirectory(distDir: string): Promise<void> {
  if (fs.existsSync(distDir)) {
    await fs.rm(distDir, { recursive: true });
  }

  await fs.copy(PUBLIC_DIR, distDir);
}
