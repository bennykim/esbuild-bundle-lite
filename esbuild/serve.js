const esbuild = require("esbuild");
const { config } = require("dotenv");
const aliasConfig = require("./plugins/aliasConfig");
const {
  prepareDistDirectory,
  createClientEnvironment,
  DIST_DIR,
} = require("./common");

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

    const { port } = await context.serve({
      port: DEFAULT_PORT,
      servedir: DIST_DIR,
      fallback: `${DIST_DIR}/index.html`,
    });

    console.log(`Serving app at http://localhost:${port}.`);
  } catch (err) {
    console.error("Failed to build client:", err);
    process.exit(1);
  }
};

const getBuildConfig = (clientEnv) => ({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  sourcemap: true,
  define: clientEnv,
  loader: { ".png": "file", ".svg": "file" },
  plugins: [aliasConfig],
  outfile: `${DIST_DIR}/bundle.js`,
  banner: {
    js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
  },
});

runDevServer();
