import type {
  Ctx,
  MiddlewareRequest as Req,
  MiddlewareResponse as Res,
} from "blitz";
import type { User } from "db";

import { getSession } from "blitz";

import httpMocks from "node-mocks-http";

// This import is important, it sets the isAuthorized method in global.sessionConfig
import "../blitz.config";

interface CreateMockContextOptions {
  user?: User;
  reqOptions?: httpMocks.RequestOptions;
  resOptions?: httpMocks.ResponseOptions;
}

// Based on https://github.com/blitz-js/blitz/issues/2654#issuecomment-904426530
// Creates a mock context for use in tests and scripts.
const createMockContext = async <C extends Ctx>({
  user,
  reqOptions,
  resOptions,
}: CreateMockContextOptions = {}) => {
  const mocks = httpMocks.createMocks<any, any>(reqOptions, resOptions);
  const mockReq: Req = mocks.req;
  const mockRes: Res<C> = mocks.res;

  await getSession(mockReq, mockRes);

  if (user) {
    // Simulate login by adding the user to the session data
    Object.assign(mockRes.blitzCtx.session.$publicData, {
      userId: user.id,
      role: user.role,
    });
  }

  return { req: mockReq, res: mockRes, ctx: mockRes.blitzCtx };
};

export default createMockContext;
