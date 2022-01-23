import type { BlitzPage } from "blitz";

import { useQuery, useRouter } from "blitz";

import FixedLayout from "app/common/layouts/fixed-layout";
import GearDnd from "app/modules/gear-dnd/components/gear-dnd";
import Subheader from "app/common/components/subheader";

import packQuery from "../../../queries/pack-query";
import PacksSubheaderContent from "../../../components/packs-subheader-content";

const PackSharePage: BlitzPage = () => {
  const router = useRouter();

  const [pack] = useQuery(packQuery, {
    id: router.query.packId as string,
  });

  return <GearDnd state={pack.categories} vertical={false} readonly />;
};

PackSharePage.getLayout = (page) => {
  return (
    <FixedLayout
      subheader={
        <Subheader>
          <PacksSubheaderContent />
        </Subheader>
      }
    >
      {page}
    </FixedLayout>
  );
};

export default PackSharePage;
