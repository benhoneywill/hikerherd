import type { BlitzPage } from "blitz";

import BoxLayout from "app/layouts/box-layout";

const NotFoundPage: BlitzPage = () => {
  return null;
};

NotFoundPage.getLayout = (page) => (
  <BoxLayout title="Not found" description="That page doesn't exist.">
    {page}
  </BoxLayout>
);

export default NotFoundPage;
