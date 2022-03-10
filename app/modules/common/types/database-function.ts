import type { PrismaClient } from "db";
import type { AuthenticatedMiddlewareCtx } from "blitz";

type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

export type DatabaseFunction<Params extends {}, ReturnValue = void> = (
  transaction: PrismaTransactionClient,
  ctx: AuthenticatedMiddlewareCtx,
  params: Params
) => Promise<ReturnValue>;
