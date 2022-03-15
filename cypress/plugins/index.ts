import { loadEnvConfig } from "@blitzjs/env";

loadEnvConfig();

import "./register-ts-paths";

import factory from "test/factory";

import db from "db";

let needsReset = true;

const pluginConfig: Cypress.PluginConfig = (on) => {
  on("task", {
    factory,

    "db:reset": async () => {
      if (needsReset) {
        await db.$reset();
        needsReset = false;
      }

      return true;
    },
  });
};

export default pluginConfig;
