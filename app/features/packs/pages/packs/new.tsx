import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import SidebarLayout from "app/common/layouts/sidebar-layout";

import PackForm from "../../components/pack-form";

const NewPackPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <PackForm
      onSuccess={(pack) => router.push(Routes.PackPage({ id: pack.id }))}
    />
  );
};

NewPackPage.authenticate = { redirectTo: Routes.LoginPage() };
NewPackPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default NewPackPage;
