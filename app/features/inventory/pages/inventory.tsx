import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import { FcList } from "react-icons/fc";

import FixedLayout from "app/modules/common/layouts/fixed-layout";
import Subheader from "app/modules/common/components/subheader";

import GearOrganizer from "../components/gear-organizer";
import TypePicker from "../components/type-picker";

const InventoryPage: BlitzPage = () => {
  return <GearOrganizer type="INVENTORY" />;
};

InventoryPage.authenticate = { redirectTo: Routes.LoginPage() };
InventoryPage.getLayout = (page) => (
  <FixedLayout
    subheader={
      <Subheader>
        <TypePicker title="Inventory" icon={FcList} />
      </Subheader>
    }
  >
    {page}
  </FixedLayout>
);

export default InventoryPage;
