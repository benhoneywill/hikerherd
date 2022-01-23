import type { BlitzPage } from "blitz";

import { useQuery, useRouter } from "blitz";

import FixedLayout from "app/modules/common/layouts/fixed-layout";
import DragAndDrop from "app/modules/drag-and-drop/components/drag-and-drop";
import PackSubheader from "app/features/packs/components/pack-subheader";
import packOrganizerQuery from "app/features/packs/queries/pack-organizer-query";

const PackSharePage: BlitzPage = () => {
  const router = useRouter();

  const [pack] = useQuery(packOrganizerQuery, {
    id: router.query.packId as string,
  });

  return <DragAndDrop state={pack.categories} readonly />;
};

PackSharePage.getLayout = (page) => {
  return <FixedLayout subheader={<PackSubheader />}>{page}</FixedLayout>;
};

export default PackSharePage;
