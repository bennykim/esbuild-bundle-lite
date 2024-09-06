import { build } from "../esbuild/build";
import { findConfigFile, loadConfig } from "../esbuild/config";
import { DEVELOPMENT, PRODUCTION } from "../esbuild/constants";
import {
  handleBuildCommand,
  handleDevCommand,
  setupCLI,
} from "../esbuild/index";
import { serve } from "../esbuild/serve";
import { logger } from "../esbuild/utils";

jest.mock("../esbuild/build");
jest.mock("../esbuild/serve");
jest.mock("../esbuild/config");
jest.mock("../esbuild/utils", () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe("CLI", () => {
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    exitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: string | number | null | undefined) => {
        throw new Error(`Process exit was called with code ${code}`);
      });
  });

  afterEach(() => {
    exitSpy.mockRestore();
  });

  describe("setupCLI", () => {
    it("should set up CLI commands correctly", () => {
      const program = setupCLI();

      expect(program.name()).toBe("ebl");
      expect(program.description()).toBe("esbuild-based bundler for React");
      expect(program.version()).toBe("0.1.0-RC2");

      const commands = program.commands.map((cmd) => cmd.name());
      expect(commands).toContain("dev");
      expect(commands).toContain("build");
    });
  });

  describe("handleDevCommand", () => {
    it("should handle dev command correctly", async () => {
      const mockConfig = { env: { nodeEnv: "" } };
      (findConfigFile as jest.Mock).mockReturnValue("mock-config-path");
      (loadConfig as jest.Mock).mockResolvedValue(mockConfig);

      await handleDevCommand();

      expect(findConfigFile).toHaveBeenCalled();
      expect(loadConfig).toHaveBeenCalledWith("mock-config-path");
      expect(mockConfig.env.nodeEnv).toBe(DEVELOPMENT);
      expect(serve).toHaveBeenCalledWith(mockConfig);
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it("should handle errors in dev command", async () => {
      const error = new Error("Config file not found");
      (findConfigFile as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(handleDevCommand()).rejects.toThrow(
        "Process exit was called with code 1"
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Error starting development server:",
        error
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("handleBuildCommand", () => {
    it("should handle build command correctly", async () => {
      const mockConfig = { env: { nodeEnv: "" } };
      (findConfigFile as jest.Mock).mockReturnValue("mock-config-path");
      (loadConfig as jest.Mock).mockResolvedValue(mockConfig);

      await handleBuildCommand();

      expect(findConfigFile).toHaveBeenCalled();
      expect(loadConfig).toHaveBeenCalledWith("mock-config-path");
      expect(mockConfig.env.nodeEnv).toBe(PRODUCTION);
      expect(build).toHaveBeenCalledWith(mockConfig);
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it("should handle errors in build command", async () => {
      const error = new Error("Build error");
      (findConfigFile as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(handleBuildCommand()).rejects.toThrow(
        "Process exit was called with code 1"
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Error building for production:",
        error
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });
});
