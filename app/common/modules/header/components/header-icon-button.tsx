import type { FC, ReactElement } from "react";

import { IconButton } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";

const HeaderIconButton: FC<{
  label: string;
  onClick: () => void;
  icon: ReactElement;
}> = ({ label, onClick, icon }) => {
  return (
    <Tooltip label={label}>
      <IconButton
        size="sm"
        variant="ghost"
        aria-label={label}
        onClick={onClick}
        icon={icon}
      />
    </Tooltip>
  );
};

export default HeaderIconButton;
