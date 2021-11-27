import type { Ctx, InvokeWithMiddlewareConfig } from "blitz";

import { dehydrate } from "blitz";

import { invokeWithMiddleware, getQueryKey, QueryClient } from "blitz";

type QueryResolver<Params, Result> = (params: Params, ctx: Ctx) => Promise<Result>;

class PrefetchQueryClient {
  queryClient: QueryClient;
  context: InvokeWithMiddlewareConfig;

  constructor(context: InvokeWithMiddlewareConfig) {
    this.queryClient = new QueryClient();
    this.context = context;
  }

  async prefetchQuery<Params, Result>(query: QueryResolver<Params, Result>, params: Params) {
    const queryKey = getQueryKey(query, params);
    const result = await invokeWithMiddleware(query, params, this.context);
    await this.queryClient.prefetchQuery(queryKey, () => result);
    return result;
  }

  dehydrate() {
    return dehydrate(this.queryClient);
  }
}

export default PrefetchQueryClient;
