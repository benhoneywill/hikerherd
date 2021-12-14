import type { FC } from "react";
import type { AppProps } from "blitz";

import { Suspense } from "react";
import { ErrorBoundary, useQueryErrorResetBoundary } from "blitz";

import { ChakraProvider } from "@chakra-ui/react";

import AppErrorFallback from "app/core/components/app-error-fallback";
import PageLoader from "app/core/components/page-loader";

import theme from "../theme/theme";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const { reset } = useQueryErrorResetBoundary();
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary FallbackComponent={AppErrorFallback} onReset={reset}>
        {getLayout(
          <Suspense fallback={<PageLoader />}>
            <Component {...pageProps} />
          </Suspense>
        )}
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
