import esbuild from "esbuild";
import { aliasConfig } from "./plugins/aliasConfig.js";
import {
  prepareDistDirectory,
  createClientEnvironment,
  DIST_DIR,
} from "./common/index.js";

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
