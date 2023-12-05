import esbuild from "esbuild";
import { config } from "dotenv";
import { aliasConfig } from "./plugins/aliasConfig.js";
import {
  prepareDistDirectory,
  createClientEnvironment,
  DIST_DIR,
} from "./common/index.js";

config();
const { PORT } = process.env;
const DEFAULT_PORT = parseInt(PORT, 10) || 3001;

const runDevServer = async () => {
  await prepareDistDirectory();
  const clientEnv = createClientEnvironment("development");
  await buildClient(clientEnv);
};

const buildClient = async (clientEnv) => {
  try {
    const context = await esbuild.context(getBuildConfig(clientEnv));
    await context.watch();
    await context.serve({
      port: DEFAULT_PORT,
      servedir: DIST_DIR,
      fallback: `${DIST_DIR}/index.html`,
    });
  } catch (err) {
    console.error("Failed to build client:", err);
    process.exit(1);
  }
};

const getBuildConfig = (clientEnv) => ({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  sourcemap: true,
  logLevel: "info",
  define: clientEnv,
  loader: { ".png": "file", ".svg": "file" },
  plugins: [aliasConfig],
  outfile: `${DIST_DIR}/bundle.js`,
  banner: {
    js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
  },
});

runDevServer();
