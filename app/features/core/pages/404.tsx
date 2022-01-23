import type { BlitzPage } from "blitz";

import { Link, Routes } from "blitz";

import { Button } from "@chakra-ui/button";

import BoxLayout from "../../modules/common/layouts/box-layout";

const NotFoundPage: BlitzPage = () => {
  return (
    <Link href={Routes.HomePage()} passHref>
      <Button as="a" size="lg" isFullWidth>
        Go home
      </Button>
    </Link>
  );
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
