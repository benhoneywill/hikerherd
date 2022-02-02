import type { FC } from "react";

import { useQuery } from "blitz";
import { useState } from "react";

import packContext from "../contexts/pack-context";
import useCalculatePackTotals from "../hooks/use-calculate-pack-totals";
import packOrganizerQuery from "../queries/pack-organizer-query";
import PackForm from "../components/pack-form";
import PackDetails from "../components/pack-details";
import packQuery from "../queries/pack-query";

const { Provider } = packContext;

type PackProviderProps = {
  id: string;
  share?: boolean;
};

const PackProvider: FC<PackProviderProps> = ({ id, share, children }) => {
  const [editingPack, setEditingPack] = useState(false);
  const [showingDetails, setShowingDetails] = useState(false);

  const [pack, { refetch: refetchPack }] = useQuery(
    packQuery,
    { id },
    { suspense: false }
  );

  const [packOrganizer, { refetch: refetchOrganizer }] = useQuery(
    packOrganizerQuery,
    { id },
    { suspense: false }
  );

  const { categories, totalWeight, packWeight, baseWeight } =
    useCalculatePackTotals(packOrganizer || []);

  return (
    <Provider
      value={{
        share,

        editPack: () => setEditingPack(true),
        showDetails: () => setShowingDetails(true),

        pack: pack || { id },

        categories,
        totalWeight,
        packWeight,
        baseWeight,

        refetchOrganizer,
      }}
    >
      <PackForm
        packId={id}
        isOpen={editingPack}
        onClose={() => setEditingPack(false)}
        onSuccess={() => refetchPack()}
      />

      <PackDetails
        onClose={() => setShowingDetails(false)}
        isOpen={showingDetails}
      />

      {children}
    </Provider>
  );
};

export default PackProvider;
