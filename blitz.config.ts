import type { BlitzConfig } from "blitz";

import { sessionMiddleware, simpleRolesIsAuthorized } from "blitz";

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "blitz",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
};

export default config;
