import { existsSync } from "fs";
import { merge } from "lodash";
import * as path from "path";

import { BUNDLE_CONFIG_NAME, ESBUILD_CONFIG_NAME } from "../constants";
import { aliasConfig } from "../plugins";

import { type BuildOptions } from "esbuild";

export interface CustomOptions extends BuildOptions {
  entry: string[];
  distDir: string;
  port: number;
  env: Record<string, string>;
  _configSource?: string;
}

export const defaultConfig: CustomOptions = {
  entry: ["src/index.tsx"],
  distDir: "dist",
  outfile: "bundle.js",
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
  return `/${ESBUILD_CONFIG_NAME}`;
};

export const createConfig = async (
  userConfigPath: string
): Promise<CustomOptions> => {
  let userConfig: Partial<CustomOptions> = {};
  try {
    userConfig = (await import(userConfigPath)).default;
  } catch (error) {
    console.warn(`Failed to load user config from ${userConfigPath}:`, error);
  }

  const mergedConfig = merge({}, defaultConfig, userConfig);
  validateConfig(mergedConfig);
  return mergedConfig;
};

export const validateConfig = (config: CustomOptions): void => {
  if (!Array.isArray(config.entry) || config.entry.length === 0) {
    throw new Error("Config error: entry must be a non-empty array");
  }
  if (typeof config.distDir !== "string" || config.distDir.trim() === "") {
    throw new Error("Config error: distDir must be a non-empty string");
  }
};

export const getCommonBuildConfig = (
  config: CustomOptions,
  clientEnv: Record<string, string>
): BuildOptions => {
  const { entry, loader, distDir, outfile } = config;

  return {
    entryPoints: entry,
    bundle: true,
    define: clientEnv,
    loader: loader,
    plugins: [aliasConfig],
    outfile: `${distDir}/${outfile}`,
    jsx: "automatic",
  };
};
