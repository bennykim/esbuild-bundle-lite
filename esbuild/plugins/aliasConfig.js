import { aliasPath } from "esbuild-plugin-alias-path";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

export const aliasConfig = aliasPath({
  alias: {
    "@/*": resolve(dirName, "../../src/"),
  },
});
