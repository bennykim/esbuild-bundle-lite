import esbuild from "esbuild";
import { aliasConfig } from "./plugins/aliasConfig.js";
import {
  prepareDistDirectory,
  createClientEnvironment,
} from "./common/index.js";

const runBuild = async (config) => {
  const { distDir, env } = config;

  try {
    await prepareDistDirectory(distDir);
    const clientEnv = createClientEnvironment(env);
    const result = await esbuild.build(getBuildConfig(config, clientEnv));

    console.log(await esbuild.analyzeMetafile(result.metafile));
    console.log("Build Successful.");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

const getBuildConfig = (config, clientEnv) => {
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
