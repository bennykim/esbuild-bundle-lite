import { transformKeys } from "../esbuild/utils";

describe("transformKeys", () => {
  it("should transform keys correctly", () => {
    const input = {
      apiUrl: "http://example.com",
      maxRetries: 3,
      isDebug: true,
    };
    const expected = {
      "process.env.API_URL": "'http://example.com'",
      "process.env.MAX_RETRIES": "'3'",
      "process.env.IS_DEBUG": "'true'",
    };
    expect(transformKeys(input)).toEqual(expected);
  });
});
