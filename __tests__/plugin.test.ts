import { aliasPlugin } from "../esbuild/plugins";

jest.mock("esbuild-plugin-alias-path", () => ({
  aliasPath: jest.fn().mockReturnValue("mocked-alias-plugin"),
}));

describe("aliasPlugin", () => {
  it("should create alias plugin with correct configuration", () => {
    expect(aliasPlugin).toBe("mocked-alias-plugin");
    expect(require("esbuild-plugin-alias-path").aliasPath).toHaveBeenCalledWith(
      {
        alias: {
          "@/*": expect.any(String),
        },
      }
    );
  });
});
