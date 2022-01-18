import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import { Container, Heading } from "@chakra-ui/react";
import { FcTimeline } from "react-icons/fc";

import SidebarLayout from "app/common/layouts/sidebar-layout";
import useModeColors from "app/common/hooks/use-mode-colors";
import PageHeader from "app/common/components/page-header";

import PackForm from "../../components/pack-form";

const NewPackPage: BlitzPage = () => {
  const router = useRouter();
  const { gray } = useModeColors();

  return (
    <Container
      border="1px solid"
      borderColor={gray[200]}
      borderRadius="md"
      p={6}
    >
      <PageHeader title="Create a new pack" icon={FcTimeline} />
      <PackForm
        onSuccess={(pack) => router.push(Routes.PackPage({ packId: pack.id }))}
      />
    </Container>
  );
};

NewPackPage.authenticate = { redirectTo: Routes.LoginPage() };
NewPackPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default NewPackPage;
