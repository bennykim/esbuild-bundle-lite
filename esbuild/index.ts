import { type Command, commandHandlers } from "./commands";
import { findConfigFile, loadConfig } from "./config";
import {
  BUILD_COMMAND,
  DEVELOPMENT,
  PRODUCTION,
  SERVE_COMMAND,
} from "./constants";
import { logger } from "./utils";

export const processCommand = async (
  command: Command,
  configPath: string
): Promise<void> => {
  try {
    const config = await loadConfig(configPath);
    config.env.nodeEnv = command === SERVE_COMMAND ? DEVELOPMENT : PRODUCTION;
    const handler = commandHandlers[command];
    if (handler) {
      await handler(config);
    } else {
      throw new Error(`Invalid command: ${command}`);
    }
  } catch (error) {
    logger.error("Error processing command:", error);
    throw error;
  }
};

export const executeCommand = async (): Promise<void> => {
  try {
    const commandToExecute = process.argv.find((arg): arg is Command =>
      [SERVE_COMMAND, BUILD_COMMAND].includes(arg as Command)
    );

    if (commandToExecute) {
      const configPath = findConfigFile();
      await processCommand(commandToExecute, configPath);
    } else {
      throw new Error("No valid command found. Use --serve or --build.");
    }
  } catch (error) {
    logger.error("Unhandled error:", error);
    throw error;
  }
};

if (require.main === module) {
  executeCommand().catch((error) => {
    logger.error(
      "Fatal error:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
}
