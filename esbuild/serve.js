import esbuild from "esbuild";
import { aliasConfig } from "./plugins/aliasConfig.js";
import {
  prepareDistDirectory,
  createClientEnvironment,
} from "./common/index.js";

const runDevServer = async (config) => {
  const { distDir, env } = config;
  await prepareDistDirectory(distDir);
  const clientEnv = createClientEnvironment(env);
  await buildClient(config, clientEnv);
};

const buildClient = async (config, clientEnv) => {
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

const getBuildConfig = (config, clientEnv) => {
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
