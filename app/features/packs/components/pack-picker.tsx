import { Link, Routes, useQuery } from "blitz";
import { useContext } from "react";

import { FcTimeline } from "react-icons/fc";
import { MenuItem } from "@chakra-ui/menu";

import TypePicker from "app/features/inventory/components/type-picker";

import packsQuery from "../queries/packs-query";
import packContext from "../contexts/pack-context";

const PackPicker = () => {
  const { pack } = useContext(packContext);

  const [packs] = useQuery(packsQuery, {});

  return (
    <TypePicker icon={FcTimeline} title={pack?.name}>
      {packs.map((pack) => (
        <Link
          key={pack.id}
          href={Routes.PackPage({ packId: pack.id })}
          passHref
        >
          <MenuItem as="a" icon={<FcTimeline />}>
            {pack.name}
          </MenuItem>
        </Link>
      ))}
    </TypePicker>
  );
};

export default PackPicker;
