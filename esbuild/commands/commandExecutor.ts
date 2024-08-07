import { build } from "../buildScript";
import { BUILD_COMMAND, SERVE_COMMAND } from "../constants";
import { serve } from "../serveScript";

import { type CustomOptions } from "../config";

export type Command = typeof SERVE_COMMAND | typeof BUILD_COMMAND;

export const commandHandlers: Record<
  Command,
  (config: CustomOptions) => Promise<void>
> = {
  [SERVE_COMMAND]: serve,
  [BUILD_COMMAND]: build,
};
