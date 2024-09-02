import {
  ConfigError,
  validateConfig,
  type CustomOptions,
} from "../esbuild/config";

const config: CustomOptions = {
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

describe("validateConfig", () => {
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
});
