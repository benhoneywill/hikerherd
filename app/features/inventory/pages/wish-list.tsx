import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import { FcRating } from "react-icons/fc";

import FixedLayout from "app/modules/common/layouts/fixed-layout";
import Subheader from "app/modules/common/components/subheader";
import PackPicker from "app/features/packs/components/pack-picker";

import GearOrganizer from "../components/gear-organizer";

const WishListPage: BlitzPage = () => {
  return <GearOrganizer type="WISH_LIST" />;
};

WishListPage.authenticate = { redirectTo: Routes.LoginPage() };
WishListPage.getLayout = (page) => (
  <FixedLayout
    subheader={
      <Subheader>
        <PackPicker title="Wish list" icon={FcRating} />
      </Subheader>
    }
  >
    {page}
  </FixedLayout>
);

export default WishListPage;
