import type { FC } from "react";

import { useRef, useState } from "react";

import { HStack } from "@chakra-ui/layout";
import {
  useBreakpointValue,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";

const HorizontalScroller: FC = ({ children }) => {
  const theme = useTheme();

  const bgDragEnabled = useBreakpointValue({ base: false, md: true });

  const scroller = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollBarStyles = {
    "&::-webkit-scrollbar": {
      height: "24px",
    },
    "&::-webkit-scrollbar-track": {
      background: useColorModeValue(
        theme.colors.gray[200],
        theme.colors.gray[700]
      ),
    },
    "&::-webkit-scrollbar-thumb": {
      background: useColorModeValue(
        theme.colors.gray[400],
        theme.colors.gray[500]
      ),
      borderRadius: "24px",
      border: "4px solid transparent",
      backgroundClip: "padding-box",
    },
  };

  return (
    <HStack
      spacing={0}
      overflowX="auto"
      alignItems="flex-start"
      width="100%"
      height="100%"
      css={bgDragEnabled && scrollBarStyles}
      px={3}
      pt={6}
      pb={bgDragEnabled ? 2 : 6}
      ref={scroller}
      onMouseDown={(e) => {
        if (
          scroller.current &&
          e.target === scroller.current &&
          bgDragEnabled
        ) {
          setIsDown(true);
          setStartX(e.pageX - scroller.current?.offsetLeft);
          setScrollLeft(scroller.current?.scrollLeft);
        }
      }}
      onMouseLeave={(e) => {
        if (
          scroller.current &&
          e.target === scroller.current &&
          bgDragEnabled
        ) {
          setIsDown(false);
        }
      }}
      onMouseUp={(e) => {
        if (
          scroller.current &&
          e.target === scroller.current &&
          bgDragEnabled
        ) {
          setIsDown(false);
        }
      }}
      onMouseMove={(e) => {
        if (
          scroller.current &&
          e.target === scroller.current &&
          bgDragEnabled &&
          isDown
        ) {
          e.preventDefault();
          const x = e.pageX - scroller.current.offsetLeft;
          const walk = x - startX;
          scroller.current.scrollLeft = scrollLeft - walk;
        }
      }}
    >
      {children}
    </HStack>
  );
};

export default HorizontalScroller;
