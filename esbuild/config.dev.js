const { spawn } = require("child_process");
const esbuild = require("esbuild");
const { createServer, request } = require("http");
const { config } = require("dotenv");
const serveHandler = require("serve-handler");
const fs = require("fs-extra");
const aliasConfig = require("./plugins/aliasConfig");

const clients = [];

const runDevServer = async () => {
  config();
  await prepareDistDirectory();
  const clientEnv = createClientEnv();
  await buildClient(clientEnv);
  await serveClient();
};

const prepareDistDirectory = async () => {
  const distDir = "dist";
  const publicDir = "./public";
  if (fs.existsSync(distDir)) {
    await fs.rm(distDir, { recursive: true });
  }
  await fs.copy(publicDir, distDir);
};

const createClientEnv = () => {
  const clientEnv = {
    "process.env.NODE_ENV": `'dev'`,
    "process.env.API_PORT": `${process.env.API_PORT}`,
  };
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("CLIENT_")) {
      clientEnv[`process.env.${key}`] = `'${process.env[key]}'`;
    }
  });
  return clientEnv;
};

const buildClient = (clientEnv) => {
  return esbuild.build(getBuildOptions(clientEnv)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
};

const getBuildOptions = (clientEnv) => ({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  define: clientEnv,
  outfile: "dist/bundle.js",
  loader: { ".png": "file", ".svg": "file" },
  plugins: [aliasConfig],
  sourcemap: "inline",
  watch: {
    onRebuild: handleRebuild,
  },
});

const handleRebuild = async (error) => {
  setTimeout(() => {
    clients.forEach((res) => res.write("data: update\n\n"));
  }, 750);
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Client rebuilt successfully!");
  }
};

const serveClient = () => {
  const { PORT, API_PORT } = process.env;
  return esbuild.serve({ servedir: "./" }, {}).then(() => {
    createServer(handleApiRequests).listen(API_PORT);
    createServer(handleStaticFileRequests).listen(PORT);
    openBrowser(PORT);
  });
};

const handleApiRequests = (req, res) => {
  const { url, method, headers } = req;
  if (req.url === "/esbuild") {
    return clients.push(
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        Connection: "keep-alive",
      })
    );
  }

  const path = url?.split("/").pop()?.indexOf(".") > -1 ? url : `/index.html`;
  const proxyReq = request(
    { hostname: "0.0.0.0", port: 8000, path, method, headers },
    (prxRes) => {
      res.writeHead(prxRes.statusCode || 200, prxRes.headers);
      prxRes.pipe(res, { end: true });
    }
  );
  req.pipe(proxyReq, { end: true });
  return null;
};

const handleStaticFileRequests = (req, res) => {
  return serveHandler(req, res, { public: "dist" });
};

const openBrowser = (port) => {
  const url = `http://localhost:${port}`;
  const delay = 1000;
  setTimeout(() => {
    const op = {
      darwin: ["open"],
      linux: ["xdg-open"],
      win32: ["cmd", "/c", "start"],
    };
    if (clients.length === 0) {
      console.log(`Server running at ${url}`);
      spawn(op[process.platform][0], [url]);
    }
  }, delay);
};

runDevServer();
