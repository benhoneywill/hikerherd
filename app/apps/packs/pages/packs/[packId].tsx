import type { BlitzPage, GetServerSideProps } from "blitz";

import { getSession, NotFoundError, useRouter, Routes } from "blitz";

import FixedLayout from "app/layouts/fixed-layout";
import PrefetchQueryClient from "app/helpers/prefetch-query-client";

import PackOrganizer from "../../components/pack-organizer";
import PackSubheader from "../../components/pack-subheader";
import packOrganizerQuery from "../../queries/pack-organizer-query";

const PackPage: BlitzPage = () => {
  const router = useRouter();
  return <PackOrganizer id={router.query.packId as string} />;
};

PackPage.authenticate = { redirectTo: Routes.LoginPage() };
PackPage.getLayout = (page) => {
  return <FixedLayout subheader={<PackSubheader />}>{page}</FixedLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new PrefetchQueryClient(ctx);

  try {
    const packId = ctx.params?.packId as string;
    const pack = await client.prefetchQuery(packOrganizerQuery, { id: packId });
    const session = await getSession(ctx.req, ctx.res);
    if (pack.userId !== session.userId) {
      throw new NotFoundError();
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true };
    } else {
      throw error;
    }
  }

  return {
    props: {
      dehydratedState: client.dehydrate(),
    },
  };
};

export default PackPage;
