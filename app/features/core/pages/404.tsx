import type { BlitzPage } from "blitz";

import BoxLayout from "app/modules/common/layouts/box-layout";

const NotFoundPage: BlitzPage = () => {
  return null;
};

NotFoundPage.getLayout = (page) => (
  <BoxLayout
    title="Not found"
    description="That page doesn't exist. Even the best navigators get lost sometimes."
  >
    {page}
  </BoxLayout>
);

export default NotFoundPage;
