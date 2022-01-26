import type { IconProps } from "@chakra-ui/icon";
import type { FC } from "react";

import { useColorModeValue } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";

const LogoIcon: FC<IconProps> = (props) => {
  const fg = useColorModeValue("white", "#2D3748");
  const bg = useColorModeValue("#2D3748", "white");

  return (
    <Icon viewBox="0 0 203 203" {...props}>
      <rect width="203" height="203" rx="34" fill={bg} />,
      <path
        d="M164.983 142.179L107.384 52.9285C106.206 51.1037 104.178 50 102 50C99.822 50 97.794 51.1037 96.6161 52.9285L39.0166 142.179C38.395 143.142 38.0453 144.254 38.0041 145.398C37.9629 146.542 38.2319 147.676 38.7826 148.681C39.3336 149.686 40.1461 150.524 41.1346 151.108C42.1231 151.692 43.2513 152 44.4006 152H159.599C161.941 152 164.095 150.727 165.217 148.679C165.768 147.674 166.037 146.541 165.996 145.397C165.955 144.253 165.605 143.141 164.983 142.179ZM102 68.1648L119.078 94.625H102L89.2001 107.375L81.5882 99.7927L102 68.1648Z"
        fill={fg}
      />
    </Icon>
  );
};

export default LogoIcon;
