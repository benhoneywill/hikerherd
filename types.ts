import type { User, UserRole } from "db";
import type { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz";

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext;
  }

  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<UserRole>;
    PublicData: {
      userId: User["id"];
      role: UserRole;
    };
  }
}
