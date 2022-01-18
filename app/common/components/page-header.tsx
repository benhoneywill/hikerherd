import type { IconType } from "react-icons";
import type { FC } from "react";

import { Heading, HStack, Icon } from "@chakra-ui/react";

type PageHeaderProps = {
  title: string;
  icon: IconType;
};

const PageHeader: FC<PageHeaderProps> = ({ icon, title, children }) => {
  return (
    <HStack justifyContent="space-between" mb={6}>
      <HStack spacing={3}>
        <Icon as={icon} w={8} h={8} />
        <Heading size="lg">{title}</Heading>
      </HStack>

      {children}
    </HStack>
  );
};

export default PageHeader;
