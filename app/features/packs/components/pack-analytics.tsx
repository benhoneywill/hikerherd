import type { FC } from "react";
import type { ColorHues } from "@chakra-ui/react";

import { useContext } from "react";

import { useColorModeValue, useTheme } from "@chakra-ui/react";
import { Stack, Heading, Text } from "@chakra-ui/layout";

import packContext from "../contexts/pack-context";

import PackPieChart from "./pack-pie-chart";
import PackTable from "./pack-table";

const PackAnalytics: FC = () => {
  const theme = useTheme();
  const { categories } = useContext(packContext);

  const colors: ColorHues[] = [
    theme.colors.blue,
    theme.colors.purple,
    theme.colors.teal,
    theme.colors.cyan,
    theme.colors.pink,
    theme.colors.telegram,
    theme.colors.green,
    theme.colors.red,
    theme.colors.facebook,
    theme.colors.orange,
    theme.colors.yellow,
    theme.colors.linkedin,
    theme.colors.gray,
    theme.colors.messenger,
    theme.colors.whatsapp,
  ];

  const rootColorScale = colors.map(
    (color) => color[400] || theme.colors.blue[400]
  );

  const isEmpty = !categories.find(({ weight }) => !!weight);

  const bg = useColorModeValue("gray.50", "gray.800");

  if (isEmpty) {
    return (
      <Stack p={5} bg={bg}>
        <Heading size="md">This pack is empty</Heading>
        <Text>
          You need to add some gear to the pack before you can view analytics
        </Text>
      </Stack>
    );
  }

  return (
    <Stack
      px={5}
      py={12}
      pt={{ base: 3, md: 12 }}
      direction={{ base: "column", md: "row" }}
      align={{ base: "center", md: "flex-start" }}
      justify="center"
      bg={bg}
    >
      <PackPieChart rootColors={rootColorScale} colors={colors} />
      <PackTable colors={rootColorScale} />
    </Stack>
  );
};

export default PackAnalytics;
