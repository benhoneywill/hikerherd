import type { FC } from "react";
import type { ColorHues } from "@chakra-ui/react";

import { useContext } from "react";

import { useTheme } from "@chakra-ui/react";
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
    theme.colors.orange,
    theme.colors.cyan,
    theme.colors.pink,
    theme.colors.green,
    theme.colors.red,
    theme.colors.yellow,
  ];

  const rootColorScale = colors.map(
    (color) => color[400] || theme.colors.blue[400]
  );

  const isEmpty = !categories.find(({ weight }) => !!weight);

  if (isEmpty) {
    return (
      <Stack p={5}>
        <Heading size="md">This pack is empty</Heading>
        <Text>
          You need to add some gear to the pack before you can view analytics
        </Text>
      </Stack>
    );
  }

  return (
    <Stack p={5} direction={{ base: "column", md: "row" }} align="center">
      <PackPieChart rootColors={rootColorScale} colors={colors} />
      <PackTable colors={rootColorScale} />
    </Stack>
  );
};

export default PackAnalytics;
