import { existsSync } from "fs";
import { merge } from "lodash";
import * as path from "path";

import { BUNDLE_CONFIG_NAME, ESBUILD_CONFIG_NAME } from "../constants";

import type { BuildOptions, Loader } from "esbuild";

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export interface CustomOptions extends Omit<BuildOptions, "outdir"> {
  entry: string[];
  distDir: string;
  port: number;
  env: Record<string, string>;
  loader: Record<string, Loader>;
}

const defaultConfig: CustomOptions = {
  entry: ["src/index.tsx"],
  distDir: "dist",
  port: 3000,
  env: {},
  format: "esm",
  splitting: true,
  loader: { ".png": "file", ".svg": "file", ".css": "css" },
};

export const findConfigFile = (): string => {
  for (const fileName of [BUNDLE_CONFIG_NAME, ESBUILD_CONFIG_NAME]) {
    const filePath = path.resolve(process.cwd(), fileName);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  return "";
};

export const validateConfig = (config: CustomOptions): void => {
  if (!Array.isArray(config.entry) || config.entry.length === 0) {
    throw new ConfigError("entry must be a non-empty array");
  }
  if (typeof config.distDir !== "string" || config.distDir.trim() === "") {
    throw new ConfigError("distDir must be a non-empty string");
  }
  if (
    typeof config.port !== "number" ||
    config.port < 1 ||
    config.port > 65535
  ) {
    throw new ConfigError("port must be a valid port number (1-65535)");
  }
  if (
    typeof config.format !== "string" ||
    !["iife", "cjs", "esm"].includes(config.format)
  ) {
    throw new ConfigError("format must be one of 'iife', 'cjs', or 'esm'");
  }
  if (typeof config.splitting !== "boolean") {
    throw new ConfigError("splitting must be a boolean value");
  }
  if (typeof config.loader !== "object" || config.loader === null) {
    throw new ConfigError("loader must be an object");
  }
};

export const loadConfig = async (
  configPath?: string
): Promise<CustomOptions> => {
  const userConfigPath = configPath || findConfigFile();
  let userConfig: Partial<CustomOptions> = {};

  if (userConfigPath) {
    try {
      userConfig = (await import(userConfigPath)).default;
    } catch (error) {
      console.warn(`Failed to load user config from ${userConfigPath}:`, error);
    }
  }

  const mergedConfig = merge({}, defaultConfig, userConfig);
  validateConfig(mergedConfig);
  return mergedConfig;
};

export const getCommonBuildConfig = (
  config: CustomOptions,
  clientEnv: Record<string, string>
): BuildOptions => {
  const { entry, loader, distDir, format, splitting } = config;

  return {
    entryPoints: entry,
    bundle: true,
    define: clientEnv,
    loader,
    outdir: distDir,
    entryNames: "bundle",
    format,
    jsx: "automatic",
    splitting,
    chunkNames: "chunks/[name]-[hash]",
  };
};
