import type { FC } from "react";

import { useContext, useEffect, useRef, useState } from "react";

import { Box } from "@chakra-ui/layout";
import {
  useBreakpointValue,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";

import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";

const HorizontalScroller: FC = ({ children }) => {
  const theme = useTheme();
  const { compact } = useContext(userPreferencesContext);

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

  useEffect(() => {
    const handleDragEnd = () => {
      setIsDown(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (scroller.current && isDown) {
        e.preventDefault();
        const x = e.pageX - scroller.current.offsetLeft;
        const walk = x - startX;
        scroller.current.scrollLeft = scrollLeft - walk;
      }
    };

    if (bgDragEnabled) {
      document.addEventListener("mouseleave", handleDragEnd);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (bgDragEnabled) {
        document.removeEventListener("mouseleave", handleDragEnd);
        document.removeEventListener("mouseup", handleDragEnd);
        document.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isDown, bgDragEnabled, scrollLeft, startX]);

  return (
    <Box
      overflowX="auto"
      width="100%"
      height="100%"
      css={bgDragEnabled && scrollBarStyles}
      ref={scroller}
      display="flex"
      justifyContent={compact ? "center" : "stretch"}
      onMouseDown={(e) => {
        if (scroller.current && bgDragEnabled) {
          setIsDown(true);
          setStartX(e.pageX - scroller.current?.offsetLeft);
          setScrollLeft(scroller.current?.scrollLeft);
        }
      }}
    >
      {children}
    </Box>
  );
};

export default HorizontalScroller;
