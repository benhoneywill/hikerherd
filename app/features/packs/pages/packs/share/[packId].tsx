import type { BlitzPage, GetServerSideProps } from "blitz";

import { NotFoundError, useQuery, useRouter } from "blitz";
import { Fragment } from "react";

import FixedLayout from "app/modules/common/layouts/fixed-layout";
import DragAndDrop from "app/modules/drag-and-drop/components/drag-and-drop";
import PackSubheader from "app/features/packs/components/pack-subheader";
import packOrganizerQuery from "app/features/packs/queries/pack-organizer-query";
import Seo from "app/modules/common/components/seo";
import PrefetchQueryClient from "app/modules/common/helpers/prefetch-query-client";
import useEditorText from "app/modules/editor/hooks/use-editor-text";
import packQuery from "app/features/packs/queries/pack-query";

const PackSharePage: BlitzPage = () => {
  const router = useRouter();

  const [packOrganizer] = useQuery(packOrganizerQuery, {
    id: router.query.packId as string,
  });

  const [pack] = useQuery(packQuery, {
    id: router.query.packId as string,
  });

  const description = useEditorText(
    pack?.notes || "",
    {
      image: true,
      blockquote: true,
      heading: true,
      horizontalRule: true,
    },
    {
      uppercaseHeadings: false,
      limits: {
        maxChildNodes: 4,
      },
    }
  );

  return (
    <Fragment>
      <Seo title={pack.name} description={description.replace(/(\n)+/g, " ")} />
      <DragAndDrop state={packOrganizer} readonly />
    </Fragment>
  );
};

PackSharePage.getLayout = (page) => {
  return <FixedLayout subheader={<PackSubheader share />}>{page}</FixedLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new PrefetchQueryClient(ctx);

  try {
    const packId = ctx.params?.packId as string;
    await client.prefetchQuery(packOrganizerQuery, { id: packId });
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

export default PackSharePage;
