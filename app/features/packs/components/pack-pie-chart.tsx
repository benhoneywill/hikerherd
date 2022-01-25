import type { ColorHues } from "@chakra-ui/react";
import type { FC } from "react";

import { useContext, useState } from "react";

import { Box } from "@chakra-ui/layout";
import { VictoryPie, VictoryTooltip, VictoryContainer } from "victory";

import displayWeight from "app/modules/common/helpers/display-weight";
import userPreferencesContext from "app/features/users/contexts/user-preferences-context";

import packContext from "../contexts/pack-context";

const tooltipProps = {
  renderInPortal: true,
  constrainToVisibleArea: true,
  pointerLength: 0,
  flyoutPadding: { top: 4, bottom: 4, left: 8, right: 8 },
  cornerRadius: 2,
  flyoutStyle: {
    stroke: "black",
    strokeWidth: 2,
    fill: "black",
  },
  style: { fill: "white" },
};

type PackPieChartProps = {
  rootColors: string[];
  colors: ColorHues[];
};

const PackPieChart: FC<PackPieChartProps> = ({ rootColors, colors }) => {
  const { categories } = useContext(packContext);
  const { weightUnit } = useContext(userPreferencesContext);

  const [active, setActive] = useState<number>(0);

  const nonZeroCategories = categories.filter(({ weight }) => weight > 0);

  return (
    <Box
      w={300}
      mt={-5}
      alignSelf={{ base: "center", md: "stretch" }}
      flex="0 0 300px"
    >
      <VictoryContainer>
        <svg width={300} height={300}>
          <VictoryPie
            standalone={false}
            width={300}
            height={300}
            innerRadius={75}
            data={nonZeroCategories}
            x="name"
            y="weight"
            colorScale={rootColors}
            padAngle={1}
            labelComponent={
              <VictoryTooltip
                {...tooltipProps}
                text={({ datum }) =>
                  `${datum.name} (${displayWeight(
                    datum.weight,
                    weightUnit,
                    true
                  )})`
                }
              />
            }
            events={[
              {
                target: "data",
                eventHandlers: {
                  onClick: (_, data) => {
                    setActive(data.index);
                  },
                },
              },
            ]}
          />

          <g transform="translate(57, 57) scale(0.93)">
            <VictoryPie
              data={nonZeroCategories[active]?.items
                .filter((item) => item.gear.weight > 0 && item.quantity > 0)
                .map((item) => ({
                  ...item,
                  weight: item.gear.weight * item.quantity,
                }))}
              animate={{ duration: 200 }}
              colorScale={Object.values(colors[active] || {}).slice(1)}
              standalone={false}
              width={200}
              height={200}
              innerRadius={75}
              padAngle={1}
              x="gear.name"
              y="weight"
              labelComponent={
                <VictoryTooltip
                  {...tooltipProps}
                  text={({ datum }) =>
                    `${datum.gear.name} (${displayWeight(
                      datum.weight,
                      weightUnit
                    )})`
                  }
                />
              }
            />
          </g>
        </svg>
      </VictoryContainer>
    </Box>
  );
};

export default PackPieChart;
