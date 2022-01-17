import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import FixedLayout from "app/common/layouts/fixed-layout";
import Subheader from "app/common/components/subheader";

import GearOrganizer from "../components/gear-organizer";

const WishListPage: BlitzPage = () => {
  return <GearOrganizer type="WISH_LIST" />;
};

WishListPage.authenticate = { redirectTo: Routes.LoginPage() };
WishListPage.getLayout = (page) => (
  <FixedLayout subheader={<Subheader wishList />}>{page}</FixedLayout>
);

export default WishListPage;
