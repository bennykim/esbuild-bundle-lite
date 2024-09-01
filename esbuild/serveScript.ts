import * as esbuild from "esbuild";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";

import { createClientEnvironment, prepareDistDirectory } from "./common";
import { getCommonBuildConfig, type CustomOptions } from "./config";
import { aliasPlugin } from "./plugins";
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
      plugins: config.plugins || [aliasPlugin],
      write: true,
    };

    logger.info("Creating esbuild context...");
    const context = await esbuild.context(buildConfig);

    logger.info("Starting watch mode...");
    await context.watch();

    logger.info("Starting dev server...");
    const { host, port: actualPort } = await context.serve({
      servedir: distDir,
      fallback: path.join(distDir, "index.html"),
    });

    const proxyServer = http.createServer((req, res) => {
      const options = {
        hostname: host,
        port: actualPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      if (req.url && (req.url.endsWith(".js") || req.url.endsWith(".css"))) {
        const filePath = path.join(distDir, req.url);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath);
          const contentType = req.url.endsWith(".js")
            ? "application/javascript"
            : "text/css";
          res.writeHead(200, {
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
            ...(contentType === "application/javascript"
              ? { "Content-Type": "application/javascript; charset=utf-8" }
              : {}),
          });
          res.end(content);
          return;
        }
      }

      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      req.pipe(proxyReq, { end: true });
    });

    proxyServer.on("error", (error) => {
      logger.error("Proxy server error:", error);
    });

    proxyServer.listen(port, () => {
      logger.info(`Development server started at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(
      "Failed to start dev server:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
};
