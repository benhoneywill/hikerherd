import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import FixedLayout from "app/common/layouts/fixed-layout";

import GearOrganizer from "../components/gear-organizer";
import InventorySubheader from "../components/inventory-subheader";

const WishListPage: BlitzPage = () => {
  return <GearOrganizer type="WISH_LIST" />;
};

WishListPage.authenticate = { redirectTo: Routes.LoginPage() };
WishListPage.getLayout = (page) => (
  <FixedLayout subheader={<InventorySubheader />}>{page}</FixedLayout>
);

export default WishListPage;
