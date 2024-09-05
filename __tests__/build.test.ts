// src/__tests__/build.test.ts
import * as esbuild from "esbuild";

import { build } from "../esbuild/build";
import {
  createClientEnvironment,
  prepareDistDirectory,
} from "../esbuild/common";
import { getCommonBuildConfig, type CustomOptions } from "../esbuild/config";
import { aliasPlugin } from "../esbuild/plugins";
import { logger } from "../esbuild/utils";

jest.mock("esbuild");
jest.mock("../esbuild/utils", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  measurePerformance: jest.fn((name, fn) => fn()),
}));
jest.mock("../esbuild/common", () => ({
  prepareDistDirectory: jest.fn(),
  createClientEnvironment: jest.fn(),
}));
jest.mock("../esbuild/config", () => ({
  getCommonBuildConfig: jest.fn(),
}));
jest.mock("../esbuild/plugins", () => ({
  aliasPlugin: {},
}));

describe("build", () => {
  const mockConfig: CustomOptions = {
    entry: ["src/index.tsx"],
    distDir: "dist",
    port: 3000,
    env: {},
    format: "esm",
    splitting: true,
    loader: {
      ".png": "file",
      ".svg": "file",
      ".css": "css",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getCommonBuildConfig as jest.Mock).mockReturnValue({});
    (createClientEnvironment as jest.Mock).mockReturnValue({});
  });

  it("should build successfully", async () => {
    const mockResult = { metafile: {} };
    (esbuild.build as jest.Mock).mockResolvedValue(mockResult);
    (esbuild.analyzeMetafile as jest.Mock).mockResolvedValue("Build analysis");

    await build(mockConfig);

    expect(prepareDistDirectory).toHaveBeenCalledWith("dist");
    expect(createClientEnvironment).toHaveBeenCalledWith({});
    expect(getCommonBuildConfig).toHaveBeenCalledWith(mockConfig, {});
    expect(esbuild.build).toHaveBeenCalledWith(
      expect.objectContaining({
        minify: true,
        metafile: true,
        logLevel: "debug",
        plugins: [aliasPlugin],
        entryNames: "[name]-[hash]",
      })
    );
    expect(esbuild.analyzeMetafile).toHaveBeenCalledWith({});
    expect(logger.info).toHaveBeenCalledWith(
      "Build analysis:\n" + "Build analysis"
    );
    expect(logger.info).toHaveBeenCalledWith("Build Successful.");
  });

  it("should warn when metafile is undefined", async () => {
    const mockResult = { metafile: undefined };
    (esbuild.build as jest.Mock).mockResolvedValue(mockResult);

    await build(mockConfig);

    expect(logger.warn).toHaveBeenCalledWith(
      "Metafile is undefined. Build analysis not available."
    );
  });

  it("should handle build failure", async () => {
    const error = new Error("Build failed");
    (esbuild.build as jest.Mock).mockRejectedValue(error);

    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: string | number | null | undefined) => {
        throw new Error(`Process.exit called with code ${code}`);
      });

    await expect(build(mockConfig)).rejects.toThrow(
      "Process.exit called with code 1"
    );
    expect(logger.error).toHaveBeenCalledWith("Build failed:", "Build failed");
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });
});
