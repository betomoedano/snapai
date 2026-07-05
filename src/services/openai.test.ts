import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

const generateMock = jest.fn<() => Promise<any>>();
const configGet = jest.fn<() => Promise<string | undefined>>();
const OpenAIConstructor = jest.fn((_options?: any) => ({
  images: { generate: generateMock },
}));

jest.unstable_mockModule("openai", () => ({
  __esModule: true,
  default: OpenAIConstructor,
}));

jest.unstable_mockModule("./config.js", () => ({
  ConfigService: { get: configGet },
}));

const { OpenAIService } = await import("./openai.js");

const ENV_KEYS = ["SNAPAI_API_KEY", "OPENAI_API_KEY"] as const;
let savedEnv: Record<string, string | undefined>;

beforeEach(() => {
  generateMock.mockReset();
  configGet.mockReset();
  configGet.mockResolvedValue(undefined);
  OpenAIConstructor.mockReset();
  OpenAIConstructor.mockImplementation(() => ({
    images: { generate: generateMock },
  }));

  savedEnv = {};
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

describe("getClient", () => {
  it("passes a fetch override that delegates to globalThis.fetch", async () => {
    await (OpenAIService as any).getClient("sk-test");

    expect(OpenAIConstructor).toHaveBeenCalledTimes(1);
    const opts = OpenAIConstructor.mock.calls[0][0] as any;
    expect(opts.apiKey).toBe("sk-test");
    expect(typeof opts.fetch).toBe("function");

    const originalFetch = globalThis.fetch;
    try {
      const stub = jest.fn<(...args: any[]) => any>().mockReturnValue("RESP");
      globalThis.fetch = stub as any;

      const args = ["https://api.openai.com/x", { method: "GET" }];
      const returned = opts.fetch(...args);

      expect(stub).toHaveBeenCalledWith(...args);
      expect(returned).toBe("RESP");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("throws a configuration error when no API key is available", async () => {
    configGet.mockResolvedValue(undefined);

    await expect((OpenAIService as any).getClient()).rejects.toThrow(
      "OpenAI API key not configured"
    );
    // Proves the mock intercepted (so the real fs-touching ConfigService never ran).
    expect(configGet).toHaveBeenCalledWith("openai_api_key");
    expect(OpenAIConstructor).not.toHaveBeenCalled();
  });
});
