import type { PackResult } from "../queries/pack-query";
import type { FC } from "react";
import type { ColorHues } from "@chakra-ui/react";

import { useMemo } from "react";

import { Container, useTheme } from "@chakra-ui/react";
import { Stack, Box, Heading, Text, Center } from "@chakra-ui/layout";

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

  const isEmpty = !categories.find((cat) => cat.weight);

  return (
    <>
      <Stack spacing={8}>
        {isEmpty && (
          <Stack bg={gray[50]} p={5}>
            <Heading size="md">This pack is empty</Heading>
            <Text>
              You need to add some gear to the pack before you can view
              analytics
            </Text>
          </Stack>
        )}

        {!isEmpty && (
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
        )}
      </Stack>

      <Box
        py={4}
        borderBottom="1px solid"
        borderTop="1px solid"
        borderColor={gray[100]}
      >
        <Container maxW="600px">
          <Heading size="md">Pack notes</Heading>
        </Container>
      </Box>
      <Container maxW="600px" py={8}>
        {pack?.notes ? (
          <EditorHtml
            fontSize="md"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <Center bg={gray[100]} p={6} borderRadius="md">
            <Text size="md">This pack doesn't have any notes</Text>
          </Center>
        )}
      </Container>
    </>
  );
};

export default PackAnalytics;
