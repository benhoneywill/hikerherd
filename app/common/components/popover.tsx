import type { FC } from "react";

import {
  Popover as UiPopover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@chakra-ui/popover";
import { Portal } from "@chakra-ui/portal";

type PopoverProps = {
  trigger: JSX.Element;
  hideContent?: boolean;
};

const Popover: FC<PopoverProps> = ({
  trigger,
  children,
  hideContent = false,
}) => {
  return (
    <UiPopover trigger="hover">
      <PopoverTrigger>{trigger}</PopoverTrigger>
      {!hideContent && (
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>{children}</PopoverBody>
          </PopoverContent>
        </Portal>
      )}
    </UiPopover>
  );
};

export default Popover;
