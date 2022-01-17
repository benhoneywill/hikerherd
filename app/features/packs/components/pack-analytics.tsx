import type { PackResult } from "../queries/pack-query";
import type { FC } from "react";
import type { ColorHues } from "@chakra-ui/react";

import { useMemo } from "react";

import { Stack, Box } from "@chakra-ui/layout";
import { useTheme } from "@chakra-ui/react";

import EditorHtml from "app/modules/editor/components/editor-html";
import useEditorHtml from "app/modules/editor/hooks/use-editor-html";
import useModeColors from "app/common/hooks/use-mode-colors";

import PackPieChart from "./pack-pie-chart";
import PackTable from "./pack-table";

type PackAnalyticsProps = {
  pack: PackResult;
};

const PackAnalytics: FC<PackAnalyticsProps> = ({ pack }) => {
  const theme = useTheme();
  const { gray } = useModeColors();

  const html = useEditorHtml(pack?.notes || "", {
    image: true,
    blockquote: true,
    heading: true,
    horizontalRule: true,
  });

  const categories = useMemo(() => {
    return pack.categories.map((category) => ({
      ...category,
      weight: category.items.reduce(
        (total, item) => total + item.gear.weight * item.quantity,
        0
      ),
    }));
  }, [pack.categories]);

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

  return (
    <Stack spacing={8}>
      <Stack
        bg={gray[50]}
        p={5}
        direction={{ base: "column", md: "row" }}
        align="center"
      >
        <PackPieChart
          categories={categories.filter((category) => category.weight > 0)}
          rootColors={rootColorScale}
          colors={colors}
        />
        <PackTable categories={categories} colors={rootColorScale} />
      </Stack>
      <Box p={8}>
        <EditorHtml fontSize="md" dangerouslySetInnerHTML={{ __html: html }} />
      </Box>
    </Stack>
  );
};

export default PackAnalytics;
