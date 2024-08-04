import * as esbuild from "esbuild";

import { createClientEnvironment, prepareDistDirectory } from "./common";
import { getCommonBuildConfig, type CustomOptions } from "./config";
import { getPlugins } from "./plugins";
import { logger } from "./utils";

export const serve = async (config: CustomOptions): Promise<void> => {
  const { distDir, env, port } = config;

  try {
    await prepareDistDirectory(distDir);
    const clientEnv = createClientEnvironment(env);
    const buildConfig = {
      ...getCommonBuildConfig(config, clientEnv),
      sourcemap: true,
      logLevel: "info" as esbuild.LogLevel,
      plugins: getPlugins(config.plugins),
      banner: {
        js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
      },
    };

    const context = await esbuild.context(buildConfig);
    await context.watch();
    await context.serve({
      servedir: distDir,
      fallback: `${distDir}/index.html`,
      port,
    });
  } catch (error) {
    logger.error(
      "Failed to start dev server:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};
