import * as esbuild from "esbuild";
import { aliasConfig } from "./plugins/alias";
import { prepareDistDirectory, createClientEnvironment } from "./common";
import { CustomOptions } from "./config";

import type { BuildOptions } from "esbuild";

const runDevServer = async (config: CustomOptions): Promise<void> => {
  const { distDir, env } = config;
  await prepareDistDirectory(distDir);
  const clientEnv = createClientEnvironment(env);
  await buildClient(config, clientEnv);
};

const buildClient = async (
  config: CustomOptions,
  clientEnv: Record<string, string>
): Promise<void> => {
  const { port, distDir } = config;

  try {
    const context = await esbuild.context(getBuildConfig(config, clientEnv));
    await context.watch();
    await context.serve({
      port,
      servedir: distDir,
      fallback: `${distDir}/index.html`,
    });
  } catch (err) {
    console.error("Failed to build client:", err);
    process.exit(1);
  }
};

const getBuildConfig = (
  config: CustomOptions,
  clientEnv: Record<string, string>
): BuildOptions => {
  const { entry, loader, distDir, outfile } = config;

  return {
    entryPoints: entry,
    bundle: true,
    sourcemap: true,
    logLevel: "info",
    define: clientEnv,
    loader: loader,
    plugins: [aliasConfig],
    outfile: `${distDir}/${outfile}`,
    banner: {
      js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
    },
  };
};

export const serve = runDevServer;
