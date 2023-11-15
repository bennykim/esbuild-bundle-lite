const { aliasPath } = require("esbuild-plugin-alias-path");

const aliasConfig = aliasPath({
  alias: { "@/": "./src/" },
});

module.exports = aliasConfig;
