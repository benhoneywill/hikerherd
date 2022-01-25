import type { FC } from "react";

import { useContext } from "react";
import { useRouter } from "blitz";

import { FcTimeline } from "react-icons/fc";
import { Heading, HStack, Icon } from "@chakra-ui/react";

import Subheader from "app/modules/common/components/subheader";

import PackProvider from "../providers/pack-provider";
import packContext from "../contexts/pack-context";

import PackSubheaderActions from "./pack-subheader-actions";

const SubheaderPackPicker: FC = () => {
  const { pack } = useContext(packContext);
  return (
    <HStack pl={1}>
      <Icon as={FcTimeline} w={5} h={5} />
      <Heading size="sm" isTruncated>
        {pack.name}
      </Heading>
    </HStack>
  );
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
