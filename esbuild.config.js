const esbuild = require("esbuild");

const options = {
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile: "dist/bundle.js",
  loader: {
    ".tsx": "tsx",
    ".ts": "ts",
  },
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  sourcemap: true,
};

esbuild.build(options).catch(() => process.exit(1));
