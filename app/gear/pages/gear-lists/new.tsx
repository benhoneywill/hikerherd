import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import SingleColumnLayout from "app/common/layouts/single-column-layout";

import GearListForm from "../../components/gear-list-form";

const NewGearListPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <GearListForm
      onSuccess={(list) => {
        router.push(Routes.GearListPage({ id: list.id }));
      }}
    />
  );
};

NewGearListPage.authenticate = { redirectTo: Routes.LoginPage() };
NewGearListPage.getLayout = (page) => (
  <SingleColumnLayout title="New gear list">{page}</SingleColumnLayout>
);

export default NewGearListPage;
