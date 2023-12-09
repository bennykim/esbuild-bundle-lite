import { serve } from "./serve.js";
import { build } from "./build.js";
import { config as defaultConfig } from "./config/index.js";
import {
  DEVELOPMENT,
  PRODUCTION,
  SERVE_COMMAND,
  BUILD_COMMAND,
  BUNDLE_CONFIG_PATH,
} from "./constants/index.js";

async function loadUserConfig() {
  try {
    const userConfig = (await import(BUNDLE_CONFIG_PATH)).default;
    return userConfig;
  } catch (error) {
    return {};
  }
}

async function processCommand(command, config) {
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

async function executeCommand() {
  const userConfig = await loadUserConfig();
  const config = { ...defaultConfig, ...userConfig };
  const commandLineArgs = process.argv;
  const commandToExecute = commandLineArgs.find((arg) =>
    [SERVE_COMMAND, BUILD_COMMAND].includes(arg)
  );
  if (commandToExecute) {
    processCommand(commandToExecute, config);
  } else {
    console.log("No valid command found.");
  }
}

executeCommand();
