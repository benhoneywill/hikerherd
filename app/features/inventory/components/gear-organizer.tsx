import type { FC } from "react";
import type { CategoryType } from "@prisma/client";

import GearOrganizerProvider from "../providers/gear-organizer-provider";

import GearOrganizerModals from "./gear-organizer-modals";
import GearOrganizerDragAndDrop from "./gear-organizer-drag-and-drop";

type GearOrganizerProps = {
  type: CategoryType;
};

const GearOrganizer: FC<GearOrganizerProps> = ({ type }) => {
  return (
    <GearOrganizerProvider type={type}>
      <GearOrganizerModals />
      <GearOrganizerDragAndDrop />
    </GearOrganizerProvider>
  );
};

export default GearOrganizer;
