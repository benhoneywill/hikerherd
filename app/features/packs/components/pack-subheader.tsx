import type { FC } from "react";

import { useContext } from "react";
import { useRouter } from "blitz";

import { FcTimeline } from "react-icons/fc";
import { Heading, HStack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";

import Subheader from "app/modules/common/components/subheader";

import PackProvider from "../providers/pack-provider";
import packContext from "../contexts/pack-context";

import PackSubheaderActions from "./pack-subheader-actions";
import PackPicker from "./pack-picker";

const SubheaderPackPicker: FC = () => {
  const { pack, share } = useContext(packContext);

  if (share) {
    return (
      <HStack pl={1} isTruncated>
        <Icon as={FcTimeline} w={5} h={5} />
        <Heading size="sm" isTruncated>
          {pack.name}
        </Heading>
      </HStack>
    );
  }

  return <PackPicker icon={FcTimeline} title={pack.name || ""} />;
};

type PackSubheaderProps = {
  share?: boolean;
};

const PackSubheader: FC<PackSubheaderProps> = ({ share }) => {
  const router = useRouter();

  const packId = router.query.packId as string;

  return (
    <PackProvider id={packId} share={share}>
      <Subheader>
        <HStack justify="space-between">
          <SubheaderPackPicker />
          <PackSubheaderActions />
        </HStack>
      </Subheader>
    </PackProvider>
  );
};

export default PackSubheader;
