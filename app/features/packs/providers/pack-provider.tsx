import type { FC } from "react";

import { useQuery } from "blitz";
import { useState } from "react";

import packContext from "../contexts/pack-context";
import useCalculatePackTotals from "../hooks/use-calculate-pack-totals";
import packOrganizerQuery from "../queries/pack-organizer-query";
import packQuery from "../queries/pack-query";
import PackForm from "../components/pack-form";
import PackDetails from "../components/pack-details";

const { Provider } = packContext;

type PackProviderProps = {
  id: string;
};

const PackProvider: FC<PackProviderProps> = ({ id, children }) => {
  const [editingPack, setEditingPack] = useState(false);
  const [showingDetails, setShowingDetails] = useState(false);

  const [pack, { refetch: refetchPack }] = useQuery(packQuery, { id });
  const [packOrganizer] = useQuery(packOrganizerQuery, { id });

  const { categories, totalWeight, packWeight, baseWeight } =
    useCalculatePackTotals(packOrganizer.categories);

  return (
    <Provider
      value={{
        editPack: () => setEditingPack(true),
        showDetails: () => setShowingDetails(true),

        pack,

        categories,
        totalWeight,
        packWeight,
        baseWeight,
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
