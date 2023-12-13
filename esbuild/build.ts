import * as esbuild from "esbuild";
import { aliasConfig } from "./plugins";
import { prepareDistDirectory, createClientEnvironment } from "./common";
import { CustomOptions } from "./config";

import type { BuildOptions } from "esbuild";

const runBuild = async (config: CustomOptions): Promise<void> => {
  const { distDir, env } = config;

  try {
    await prepareDistDirectory(distDir);
    const clientEnv = createClientEnvironment(env);
    const result = await esbuild.build(getBuildConfig(config, clientEnv));

    if (result.metafile) {
      console.log(await esbuild.analyzeMetafile(result.metafile));
    } else {
      console.error("Metafile is undefined");
    }

    console.log("Build Successful.");
  } catch (error) {
    console.error("Build failed:", error);
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
    minify: true,
    metafile: true,
    logLevel: "debug",
    define: clientEnv,
    loader: loader,
    plugins: [aliasConfig],
    outfile: `${distDir}/${outfile}`,
  };
};

export const build = runBuild;
