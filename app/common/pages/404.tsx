import type { BlitzPage } from "blitz";

import { Head, ErrorComponent } from "blitz";

const NotFoundPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>404 Not Found</title>
      </Head>

      <ErrorComponent statusCode={404} title="This page could not be found" />
    </>
  );
};

export default NotFoundPage;
