import * as esbuild from "esbuild";

import { createClientEnvironment, prepareDistDirectory } from "./common";
import { getCommonBuildConfig, type CustomOptions } from "./config";
import { aliasPlugin } from "./plugins";
import { logger, measurePerformance } from "./utils";

export const build = async (config: CustomOptions): Promise<void> => {
  const { distDir, env } = config;

  try {
    await prepareDistDirectory(distDir);
    const clientEnv = createClientEnvironment(env);
    const buildConfig: esbuild.BuildOptions = {
      ...getCommonBuildConfig(config, clientEnv),
      minify: true,
      metafile: true,
      logLevel: "debug",
      plugins: [aliasPlugin, ...(config.plugins || [])],
      entryNames: "[name]-[hash]",
    };

    const result = await measurePerformance("Build", () =>
      esbuild.build(buildConfig)
    );

    if (result.metafile) {
      const analysis = await esbuild.analyzeMetafile(result.metafile);
      logger.info("Build analysis:\n" + analysis);
    } else {
      logger.warn("Metafile is undefined. Build analysis not available.");
    }

    logger.info("Build Successful.");
  } catch (error) {
    logger.error(
      "Build failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};
