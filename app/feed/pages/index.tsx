import type { BlitzPage } from "blitz";

import ThreeColumnLayout from "app/common/layouts/three-column-layout";

const HomePage: BlitzPage = () => {
  return (
    <p>User feed goes here (most popular [day / week / all time], latest)</p>
  );
};

HomePage.getLayout = (page) => <ThreeColumnLayout>{page}</ThreeColumnLayout>;

export default HomePage;
