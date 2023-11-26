const { aliasPath } = require("esbuild-plugin-alias-path");
const path = require("path");

const aliasConfig = aliasPath({
  alias: {
    "@/*": path.resolve(__dirname, "../../src/"),
  },
});

module.exports = aliasConfig;
