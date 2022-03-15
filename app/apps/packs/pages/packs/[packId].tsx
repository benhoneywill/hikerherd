import type { BlitzPage, GetServerSideProps } from "blitz";

import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  useRouter,
  Routes,
} from "blitz";

import FixedLayout from "app/layouts/fixed-layout";
import PrefetchQueryClient from "app/helpers/prefetch-query-client";

import PackOrganizer from "../../components/pack-organizer";
import PackSubheader from "../../components/pack-subheader";
import packQuery from "../../queries/pack-query";

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
    await client.prefetchQuery(packQuery, { id: packId });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return {
        redirect: {
          destination: Routes.LoginPage(),
          permanent: false,
        },
      };
    } else if (
      error instanceof NotFoundError ||
      error instanceof AuthorizationError
    ) {
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
