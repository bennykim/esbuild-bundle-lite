const esbuild = require("esbuild");
const aliasConfig = require("./plugins/aliasConfig");
const {
  prepareDistDirectory,
  createClientEnvironment,
  DIST_DIR,
} = require("./common");

const runBuild = async () => {
  try {
    await prepareDistDirectory();
    const clientEnv = createClientEnvironment("production");
    await esbuild.build(getBuildConfig(clientEnv));
    console.log("Build successful");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

const getBuildConfig = (clientEnv) => ({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  define: clientEnv,
  loader: { ".png": "file", ".svg": "file" },
  plugins: [aliasConfig],
  outfile: `${DIST_DIR}/bundle.js`,
});

runBuild();
