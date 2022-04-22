import type { FC } from "react";
import type { PopoverBodyProps } from "@chakra-ui/popover";

import { Portal } from "@chakra-ui/portal";
import {
  Popover as UiPopover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@chakra-ui/popover";

type PopoverProps = {
  trigger: JSX.Element;
  hideContent?: boolean;
};

const Popover: FC<PopoverProps & PopoverBodyProps> = ({
  trigger,
  children,
  hideContent = false,
  ...props
}) => {
  return (
    <UiPopover trigger="hover" flip isLazy>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      {!hideContent && (
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody {...props}>{children}</PopoverBody>
          </PopoverContent>
        </Portal>
      )}
    </UiPopover>
  );
};

export default Popover;
