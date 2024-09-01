import { type Plugin } from "esbuild";
import { aliasPath } from "esbuild-plugin-alias-path";
import { resolve } from "path";

export const aliasPlugin: Plugin = aliasPath({
  alias: {
    "@/*": resolve(__dirname, "../../src/"),
  },
});
