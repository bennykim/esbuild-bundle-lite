import { createClientEnvironment } from "../esbuild/common";
import * as utils from "../esbuild/utils";

jest.mock("../esbuild/utils");

describe("createClientEnvironment", () => {
  const mockTransformKeys = utils.transformKeys as jest.MockedFunction<
    typeof utils.transformKeys
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {};
  });

  it("should create client environment correctly", () => {
    mockTransformKeys.mockReturnValue({
      "process.env.API_URL": "'http://example.com'",
    });

    process.env.CLIENT_TEST_VALUE = "test_value";

    const result = createClientEnvironment({ apiUrl: "http://example.com" });

    expect(result).toEqual({
      "process.env.API_URL": "'http://example.com'",
      "process.env.CLIENT_TEST_VALUE": "'test_value'",
    });

    expect(mockTransformKeys).toHaveBeenCalledWith({
      apiUrl: "http://example.com",
    });
  });
});
