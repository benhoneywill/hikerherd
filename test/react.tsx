import type { BlitzRouter } from "blitz";
import type { FC } from "react";

import { RouterContext, BlitzProvider } from "blitz";

import { render as defaultRender } from "@testing-library/react";
import { renderHook as defaultRenderHook } from "@testing-library/react-hooks";

// --------------------------------------------------------------------------------
// This file customizes the render() and renderHook() test functions provided
// by React testing library. It adds a router context wrapper with a mocked router.
//
// You should always import `render` and `renderHook` from this file when writing tests
//
// This is the place to add any other context providers you need while testing.
// --------------------------------------------------------------------------------

/* Export each of testing-library's exports so that we can import everything from here */
export * from "@testing-library/react";

/* A default mocked router for use in the router context */
export const mockRouter: BlitzRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  params: {},
  query: {},
  isReady: true,
  isLocaleDomain: false,
  isPreview: false,
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
};

type DefaultTestWrapperProps = {
  dehydratedState?: unknown;
  router?: Partial<BlitzRouter>;
};

/* A default wrapper for tested components */
export const DefaultTestWrapper: FC<DefaultTestWrapperProps> = ({
  children,
  dehydratedState,
  router,
}) => (
  <BlitzProvider dehydratedState={dehydratedState}>
    <RouterContext.Provider value={{ ...mockRouter, ...router }}>
      {children}
    </RouterContext.Provider>
  </BlitzProvider>
);

type DefaultParams = Parameters<typeof defaultRender>;
type RenderUI = DefaultParams[0];
type RenderOptions = DefaultParams[1] & DefaultTestWrapperProps;

/* Override the default test render with our own */
export const render = (
  ui: RenderUI,
  { wrapper, router, dehydratedState, ...options }: RenderOptions = {}
) => {
  if (!wrapper) {
    wrapper = ({ children }) => (
      <DefaultTestWrapper
        dehydratedState={dehydratedState}
        router={{ ...mockRouter, ...router }}
      >
        {children}
      </DefaultTestWrapper>
    );
  }

  return defaultRender(ui, { wrapper, ...options });
};

type DefaultHookParams = Parameters<typeof defaultRenderHook>;
type RenderHook = DefaultHookParams[0];
type RenderHookOptions = DefaultHookParams[1] & {
  router?: Partial<BlitzRouter>;
  dehydratedState?: unknown;
};

/* Override the default test renderHook with our own */
export const renderHook = (
  hook: RenderHook,
  { wrapper, router, dehydratedState, ...options }: RenderHookOptions = {}
) => {
  if (!wrapper) {
    wrapper = ({ children }) => (
      <DefaultTestWrapper
        dehydratedState={dehydratedState}
        router={{ ...mockRouter, ...router }}
      >
        {children}
      </DefaultTestWrapper>
    );
  }

  return defaultRenderHook(hook, { wrapper, ...options });
};
