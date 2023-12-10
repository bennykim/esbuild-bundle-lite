import { aliasPath } from "esbuild-plugin-alias-path";
import { resolve } from "path";
import type { Plugin } from "esbuild";

export const aliasConfig: Plugin = aliasPath({
  alias: {
    "@/*": resolve(__dirname, "../../src/"),
  },
});
