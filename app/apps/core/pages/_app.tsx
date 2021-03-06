import type { FC } from "react";
import type { AppProps } from "blitz";

import "../styles/core.css";

import { Suspense } from "react";
import { ErrorBoundary, useQueryErrorResetBoundary } from "blitz";

import { ChakraProvider } from "@chakra-ui/react";

import UserPreferencesProvider from "app/apps/users/providers/user-preferences-provider";

import AppErrorFallback from "../components/app-error-fallback";
import PageLoader from "../components/page-loader";
import LayoutLoader from "../components/layout-loader";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const { reset } = useQueryErrorResetBoundary();

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ChakraProvider portalZIndex={4}>
      <ErrorBoundary FallbackComponent={AppErrorFallback} onReset={reset}>
        <UserPreferencesProvider>
          <Suspense fallback={<LayoutLoader />}>
            {getLayout(
              <Suspense fallback={<PageLoader />}>
                <Component {...pageProps} />
              </Suspense>
            )}
          </Suspense>
        </UserPreferencesProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
