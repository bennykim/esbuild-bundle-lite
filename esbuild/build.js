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
    const result = await esbuild.build(getBuildConfig(clientEnv));
    console.log(await esbuild.analyzeMetafile(result.metafile));
    console.log("Build Successful.");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

const getBuildConfig = (clientEnv) => ({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  metafile: true,
  logLevel: "debug",
  define: clientEnv,
  loader: { ".png": "file", ".svg": "file" },
  plugins: [aliasConfig],
  outfile: `${DIST_DIR}/bundle.js`,
});

runBuild();
