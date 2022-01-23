import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import { FcRating } from "react-icons/fc";

import FixedLayout from "app/modules/common/layouts/fixed-layout";
import Subheader from "app/modules/common/components/subheader";

import GearOrganizer from "../components/gear-organizer";
import TypePicker from "../components/type-picker";

const WishListPage: BlitzPage = () => {
  return <GearOrganizer type="WISH_LIST" />;
};

WishListPage.authenticate = { redirectTo: Routes.LoginPage() };
WishListPage.getLayout = (page) => (
  <FixedLayout
    subheader={
      <Subheader>
        <TypePicker title="Wish list" icon={FcRating} />
      </Subheader>
    }
  >
    {page}
  </FixedLayout>
);

export default WishListPage;
