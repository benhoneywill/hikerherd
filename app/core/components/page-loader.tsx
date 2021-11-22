import type { FC } from "react";

import { Skeleton } from "@chakra-ui/skeleton";

const PageLoader: FC = () => {
  return <Skeleton position="fixed" top="0" left="0" right="0" bottom="0" zIndex="-1" />;
};

export default PageLoader;
