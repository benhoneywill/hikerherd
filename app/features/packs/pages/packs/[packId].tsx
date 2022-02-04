import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import FixedLayout from "app/modules/common/layouts/fixed-layout";

import PackOrganizer from "../../components/pack-organizer";
import PackSubheader from "../../components/pack-subheader";

const PackPage: BlitzPage = () => {
  const router = useRouter();
  return <PackOrganizer id={router.query.packId as string} />;
};

PackPage.authenticate = { redirectTo: Routes.LoginPage() };
PackPage.getLayout = (page) => {
  return <FixedLayout subheader={<PackSubheader />}>{page}</FixedLayout>;
};

export default PackPage;
