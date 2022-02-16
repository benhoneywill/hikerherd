import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import FixedLayout from "app/modules/common/layouts/fixed-layout";

import GearOrganizer from "../components/gear-organizer";
import InventorySubheader from "../components/inventory-subheader";

const InventoryPage: BlitzPage = () => {
  return <GearOrganizer type="INVENTORY" />;
};

InventoryPage.authenticate = { redirectTo: Routes.LoginPage() };
InventoryPage.getLayout = (page) => (
  <FixedLayout subheader={<InventorySubheader type="INVENTORY" />}>
    {page}
  </FixedLayout>
);

export default InventoryPage;
