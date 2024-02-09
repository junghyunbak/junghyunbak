import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
};

const customJestConfig = async () => ({
  ...(await createJestConfig(config)()),
  transformIgnorePatterns: ["/node_modules/(?!.*)"],
});

export default customJestConfig;
