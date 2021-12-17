import type { BlitzPage } from "blitz";

import ThreeColumnLayout from "app/common/layouts/three-column-layout";

const ShakedownsPage: BlitzPage = () => {
  return <p>Shakedowns go here</p>;
};

ShakedownsPage.getLayout = (page) => (
  <ThreeColumnLayout>{page}</ThreeColumnLayout>
);

export default ShakedownsPage;
