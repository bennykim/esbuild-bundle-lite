import { Command, commandHandlers } from "./commands";
import { createConfig, findConfigFile } from "./config";
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
    const config = await createConfig(configPath);
    config.env.nodeEnv = command === SERVE_COMMAND ? DEVELOPMENT : PRODUCTION;
    const handler = commandHandlers[command];
    if (handler) {
      await handler(config);
    } else {
      logger.error(`Invalid command: ${command}`);
      process.exit(1);
    }
  } catch (error) {
    logger.error("Error processing command:", error);
    process.exit(1);
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
      logger.error("No valid command found. Use --serve or --build.");
      process.exit(1);
    }
  } catch (error) {
    logger.error("Unhandled error:", error);
    process.exit(1);
  }
};

executeCommand().catch((error) => {
  logger.error(
    "Fatal error:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
