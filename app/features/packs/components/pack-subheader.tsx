import type { FC } from "react";

import { useRouter } from "blitz";

import Subheader from "app/modules/common/components/subheader";

import PackProvider from "../providers/pack-provider";

import PackPicker from "./pack-picker";
import PackSubheaderActions from "./pack-subheader-actions";

const PackSubheader: FC = () => {
  const router = useRouter();

  const packId = router.query.packId as string;

  return (
    <PackProvider id={packId}>
      <Subheader>
        <PackPicker />
        <PackSubheaderActions />
      </Subheader>
    </PackProvider>
  );
};

export default PackSubheader;
