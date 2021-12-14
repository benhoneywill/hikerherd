import { invokeWithMiddleware, getQueryKey } from "blitz";

import PrefetchQueryClient from "./prefetch-query-client";

jest.mock("blitz", () => ({
  ...jest.requireActual<Record<string, unknown>>("blitz"),
  invokeWithMiddleware: jest.fn(),
  getQueryKey: jest.fn(),
}));

const mockInvokeWithMiddleware = invokeWithMiddleware as jest.Mock;
const mockGetQueryKey = getQueryKey as jest.Mock;
const mockContext = {} as any;

const mockQuery = ({ id }: { id: string }) => {
  return Promise.resolve({ id });
};

beforeEach(() => {
  mockInvokeWithMiddleware.mockImplementation((query, params) => query(params));
});

afterEach(() => {
  mockInvokeWithMiddleware.mockReset();
  mockGetQueryKey.mockReset();
});

describe("PrefetchQueryClient", () => {
  it("the dehydrated client should be empty cache when no queries have been run", () => {
    const client = new PrefetchQueryClient(mockContext);
    const dehydratedState = client.dehydrate();

    expect(dehydratedState.queries).toEqual([]);
  });

  it("should return the result from the prefetch method", async () => {
    const client = new PrefetchQueryClient(mockContext);

    mockGetQueryKey.mockReturnValueOnce("fake-key");
    const result = await client.prefetchQuery(mockQuery, { id: "1" });
    expect(result).toEqual({ id: "1" });
  });

  it("the dehydrated client should contain the result of the query", async () => {
    const client = new PrefetchQueryClient(mockContext);

    mockGetQueryKey.mockReturnValueOnce("fake-key");
    await client.prefetchQuery(mockQuery, { id: "1" });

    const dehydratedState = client.dehydrate();

    expect(dehydratedState.queries).toHaveLength(1);
    expect(dehydratedState.queries[0]?.state.data).toEqual({ id: "1" });
    expect(dehydratedState.queries[0]?.queryKey).toEqual("fake-key");
  });

  it("should handle prefetching multiple queries", async () => {
    const client = new PrefetchQueryClient(mockContext);

    mockGetQueryKey.mockReturnValueOnce("fake-key-1");
    await client.prefetchQuery(mockQuery, { id: "1" });

    mockGetQueryKey.mockReturnValueOnce("fake-key-2");
    await client.prefetchQuery(mockQuery, { id: "2" });

    mockGetQueryKey.mockReturnValueOnce("fake-key-3");
    await client.prefetchQuery(mockQuery, { id: "3" });

    const dehydratedState = client.dehydrate();

    expect(dehydratedState.queries).toHaveLength(3);

    expect(dehydratedState.queries[0]?.state.data).toEqual({ id: "1" });
    expect(dehydratedState.queries[0]?.queryKey).toEqual("fake-key-1");

    expect(dehydratedState.queries[1]?.state.data).toEqual({ id: "2" });
    expect(dehydratedState.queries[1]?.queryKey).toEqual("fake-key-2");

    expect(dehydratedState.queries[2]?.state.data).toEqual({ id: "3" });
    expect(dehydratedState.queries[2]?.queryKey).toEqual("fake-key-3");
  });
});
