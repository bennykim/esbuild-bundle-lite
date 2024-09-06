import {
  ConfigError,
  validateConfig,
  type CustomOptions,
} from "../esbuild/config";

describe("validateConfig", () => {
  let config: CustomOptions;

  beforeEach(() => {
    config = {
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
  });

  it("should not throw for valid config", () => {
    expect(() => validateConfig(config)).not.toThrow();
  });

  it("should throw ConfigError for invalid entry", () => {
    config.entry = [];
    expect(() => validateConfig(config)).toThrow(ConfigError);
    expect(() => validateConfig(config)).toThrow(
      "entry must be a non-empty array"
    );
  });

  it("should throw ConfigError for missing distDir", () => {
    delete (config as any).distDir;
    expect(() => validateConfig(config)).toThrow(ConfigError);
    expect(() => validateConfig(config)).toThrow(
      "distDir must be a non-empty string"
    );
  });

  it("should throw ConfigError for invalid port", () => {
    config.port = -1;
    expect(() => validateConfig(config)).toThrow(ConfigError);
    expect(() => validateConfig(config)).toThrow(
      "port must be a valid port number (1-65535)"
    );
  });
});
