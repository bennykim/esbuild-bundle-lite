import { serve } from "./serve";
import { build } from "./build";
import { CustomOptions, config as defaultConfig } from "./config";
import {
  DEVELOPMENT,
  PRODUCTION,
  SERVE_COMMAND,
  BUILD_COMMAND,
  BUNDLE_CONFIG_PATH,
} from "./constants";

async function loadUserConfig(): Promise<CustomOptions | {}> {
  try {
    const userConfig = (await import(BUNDLE_CONFIG_PATH)).default;
    return userConfig;
  } catch (error) {
    return {};
  }
}

type Command = typeof SERVE_COMMAND | typeof BUILD_COMMAND;

async function processCommand(
  command: Command,
  config: CustomOptions
): Promise<any> {
  switch (command) {
    case SERVE_COMMAND:
      config.env["nodeEnv"] = DEVELOPMENT;
      serve(config);
      break;
    case BUILD_COMMAND:
      config.env["nodeEnv"] = PRODUCTION;
      build(config);
      break;
    default:
      break;
  }
}

async function executeCommand(): Promise<void> {
  const userConfig = await loadUserConfig();
  const config = { ...defaultConfig, ...userConfig };
  const commandLineArgs = process.argv;

  const commandToExecute = commandLineArgs.find((arg) =>
    [SERVE_COMMAND, BUILD_COMMAND].includes(arg)
  ) as Command;

  if (commandToExecute) {
    processCommand(commandToExecute, config);
  } else {
    console.log("No valid command found.");
  }
}

executeCommand();
