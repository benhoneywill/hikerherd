import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import FixedLayout from "app/common/layouts/fixed-layout";
import Subheader from "app/common/components/subheader";

import GearOrganizer from "../components/gear-organizer";

const InventoryPage: BlitzPage = () => {
  return <GearOrganizer type="INVENTORY" />;
};

InventoryPage.authenticate = { redirectTo: Routes.LoginPage() };
InventoryPage.getLayout = (page) => (
  <FixedLayout subheader={<Subheader inventory />}>{page}</FixedLayout>
);

export default InventoryPage;
