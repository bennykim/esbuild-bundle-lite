import { executeCommand, processCommand } from "../esbuild";
import { type Command, commandHandlers } from "../esbuild/commands";
import { findConfigFile, loadConfig } from "../esbuild/config";
import {
  BUILD_COMMAND,
  DEVELOPMENT,
  ESBUILD_CONFIG_NAME,
  PRODUCTION,
  SERVE_COMMAND,
} from "../esbuild/constants";
import { logger } from "../esbuild/utils";

jest.mock("../esbuild/config", () => ({
  loadConfig: jest.fn(),
  findConfigFile: jest.fn(),
}));

jest.mock("../esbuild/commands", () => ({
  commandHandlers: {
    "--serve": jest.fn(),
    "--build": jest.fn(),
  },
}));

jest.mock("../esbuild/utils", () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe("commandExecutor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("processCommand", () => {
    it("should process serve command correctly", async () => {
      const mockConfig = {
        env: {
          nodeEnv: "",
        },
      };
      (loadConfig as jest.Mock).mockResolvedValue(mockConfig);

      await processCommand(SERVE_COMMAND, ESBUILD_CONFIG_NAME);

      expect(loadConfig).toHaveBeenCalledWith(ESBUILD_CONFIG_NAME);
      expect(mockConfig.env.nodeEnv).toBe(DEVELOPMENT);
      expect(commandHandlers[SERVE_COMMAND]).toHaveBeenCalledWith(mockConfig);
    });

    it("should process build command correctly", async () => {
      const mockConfig = {
        env: {
          nodeEnv: "",
        },
      };
      (loadConfig as jest.Mock).mockResolvedValue(mockConfig);

      await processCommand(BUILD_COMMAND, ESBUILD_CONFIG_NAME);

      expect(loadConfig).toHaveBeenCalledWith(ESBUILD_CONFIG_NAME);
      expect(mockConfig.env.nodeEnv).toBe(PRODUCTION);
      expect(commandHandlers[BUILD_COMMAND]).toHaveBeenCalledWith(mockConfig);
    });

    it("should handle invalid command", async () => {
      await expect(
        processCommand("--invalid" as Command, ESBUILD_CONFIG_NAME)
      ).rejects.toThrow("Invalid command: --invalid");
      expect(logger.error).toHaveBeenCalledWith(
        "Error processing command:",
        expect.any(Error)
      );
    });

    it("should handle errors during command processing", async () => {
      (loadConfig as jest.Mock).mockRejectedValue(new Error("Config error"));

      await expect(
        processCommand(SERVE_COMMAND, ESBUILD_CONFIG_NAME)
      ).rejects.toThrow("Config error");
      expect(logger.error).toHaveBeenCalledWith(
        "Error processing command:",
        expect.any(Error)
      );
    });
  });

  describe("executeCommand", () => {
    it("should execute serve command", async () => {
      process.argv = ["node", "script.js", SERVE_COMMAND];
      (findConfigFile as jest.Mock).mockReturnValue(ESBUILD_CONFIG_NAME);
      (loadConfig as jest.Mock).mockResolvedValue({ env: {} });

      await executeCommand();

      expect(findConfigFile).toHaveBeenCalled();
      expect(loadConfig).toHaveBeenCalledWith(ESBUILD_CONFIG_NAME);
      expect(commandHandlers[SERVE_COMMAND]).toHaveBeenCalled();
    });

    it("should execute build command", async () => {
      process.argv = ["node", "script.js", BUILD_COMMAND];
      (findConfigFile as jest.Mock).mockReturnValue(ESBUILD_CONFIG_NAME);
      (loadConfig as jest.Mock).mockResolvedValue({ env: {} });

      await executeCommand();

      expect(findConfigFile).toHaveBeenCalled();
      expect(loadConfig).toHaveBeenCalledWith(ESBUILD_CONFIG_NAME);
      expect(commandHandlers[BUILD_COMMAND]).toHaveBeenCalled();
    });

    it("should throw when no valid command is found", async () => {
      process.argv = ["node", "script.js", "--invalid"];

      await expect(executeCommand()).rejects.toThrow(
        "No valid command found. Use --serve or --build."
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Unhandled error:",
        expect.any(Error)
      );
    });

    it("should handle unhandled errors", async () => {
      process.argv = ["node", "script.js", SERVE_COMMAND];
      (findConfigFile as jest.Mock).mockImplementation(() => {
        throw new Error("Unhandled error");
      });

      await expect(executeCommand()).rejects.toThrow("Unhandled error");
      expect(logger.error).toHaveBeenCalledWith(
        "Unhandled error:",
        expect.any(Error)
      );
    });
  });
});
