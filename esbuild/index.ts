#!/usr/bin/env node

import { Command } from "commander";
import { build } from "./build";
import { findConfigFile, loadConfig } from "./config";
import { DEVELOPMENT, PRODUCTION } from "./constants";
import { serve } from "./serve";
import { logger } from "./utils";

export const handleDevCommand = async () => {
  try {
    const configPath = findConfigFile();
    const config = await loadConfig(configPath);
    config.env.nodeEnv = DEVELOPMENT;
    await serve(config);
  } catch (error) {
    logger.error("Error starting development server:", error);
    process.exit(1);
  }
};

export const handleBuildCommand = async () => {
  try {
    const configPath = findConfigFile();
    const config = await loadConfig(configPath);
    config.env.nodeEnv = PRODUCTION;
    await build(config);
  } catch (error) {
    logger.error("Error building for production:", error);
    process.exit(1);
  }
};

export const setupCLI = () => {
  const program = new Command();

  program
    .name("ebl")
    .description("esbuild-based bundler for React")
    .version("0.1.0-RC2");

  program
    .command("dev")
    .description("Start development server")
    .action(handleDevCommand);

  program
    .command("build")
    .description("Build for production")
    .action(handleBuildCommand);

  return program;
};

if (require.main === module) {
  const program = setupCLI();
  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}
