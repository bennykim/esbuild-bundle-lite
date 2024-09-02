import { createClientEnvironment } from "../esbuild/common";
import * as utils from "../esbuild/utils";

jest.mock("../esbuild/utils");

describe("createClientEnvironment", () => {
  it("should create client environment correctly", () => {
    const mockTransformKeys = utils.transformKeys as jest.MockedFunction<
      typeof utils.transformKeys
    >;
    mockTransformKeys.mockReturnValue({
      "process.env.API_URL": "'http://example.com'",
    });

    process.env.CLIENT_TEST_VAR = "test_value";

    const result = createClientEnvironment({ apiUrl: "http://example.com" });

    expect(result).toEqual({
      "process.env.API_URL": "'http://example.com'",
      "process.env.CLIENT_TEST_VAR": "'test_value'",
    });

    expect(mockTransformKeys).toHaveBeenCalledWith({
      apiUrl: "http://example.com",
    });
  });
});
