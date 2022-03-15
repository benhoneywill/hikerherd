import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "blitz",
  testPathIgnorePatterns: ["/node_modules/", "/cypress/"],
};

export default config;
