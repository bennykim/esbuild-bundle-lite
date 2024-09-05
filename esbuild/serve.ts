import * as esbuild from "esbuild";
import * as http from "http";

import { createClientEnvironment, prepareDistDirectory } from "./common";
import { getCommonBuildConfig, type CustomOptions } from "./config";
import { aliasPlugin } from "./plugins";
import { logger } from "./utils";

export const serve = async (config: CustomOptions): Promise<void> => {
  const { distDir, env, port } = config;

  try {
    await prepareDistDirectory(distDir);
    const clientEnv = createClientEnvironment(env);
    const buildConfig: esbuild.BuildOptions = {
      ...getCommonBuildConfig(config, clientEnv),
      sourcemap: true,
      logLevel: "info",
      plugins: [aliasPlugin, ...(config.plugins || [])],
      write: false,
    };

    const context = await esbuild.context(buildConfig);
    await context.watch();

    const { host, port: esbuildPort } = await context.serve({
      servedir: distDir,
      port,
    });

    const server = http.createServer((req, res) => {
      const options: http.RequestOptions = {
        hostname: host,
        port: esbuildPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      req.pipe(proxyReq, { end: true });
    });

    server.on("error", (error) => {
      logger.error("Proxy server error:", error);
    });
  } catch (error) {
    logger.error(
      "Failed to start dev server:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
};
