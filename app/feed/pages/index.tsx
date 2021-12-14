import type { BlitzPage } from "blitz";

import ThreeColumnLayout from "app/core/layouts/three-column-layout";

const HomePage: BlitzPage = () => {
  return <p>User feed goes here</p>;
};

HomePage.getLayout = (page) => <ThreeColumnLayout>{page}</ThreeColumnLayout>;

export default HomePage;
