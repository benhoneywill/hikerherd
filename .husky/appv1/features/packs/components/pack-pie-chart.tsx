import type { ColorHues } from "@chakra-ui/react";
import type { FC } from "react";
import type { PackResult } from "../queries/pack-query";

import { useState } from "react";

import { Box } from "@chakra-ui/layout";
import { VictoryPie, VictoryTooltip } from "victory";

import displayWeight from "app/common/helpers/display-weight";
import useUserPreferences from "app/features/users/hooks/use-user-preferences";

type PackPieChartProps = {
  categories: Array<PackResult["categories"][number] & { weight: number }>;
  rootColors: string[];
  colors: ColorHues[];
};

const PackPieChart: FC<PackPieChartProps> = ({
  categories,
  rootColors,
  colors,
}) => {
  const [active, setActive] = useState<number>(0);
  const { weightUnit } = useUserPreferences();

  return (
    <Box w={300}>
      <svg width={300} height={300}>
        <VictoryPie
          standalone={false}
          width={300}
          height={300}
          innerRadius={75}
          data={categories}
          x="name"
          y="weight"
          colorScale={rootColors}
          labelComponent={
            <VictoryTooltip
              constrainToVisibleArea
              flyoutStyle={{ stroke: "black", strokeWidth: 2, fill: "black" }}
              style={{ fill: "white" }}
              text={({ datum }) =>
                `${datum.name} (${displayWeight(
                  datum.weight,
                  weightUnit,
                  true
                )})`
              }
            />
          }
          padAngle={2}
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
            data={categories[active]?.items
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
            x="gear.name"
            y="weight"
            labelComponent={
              <VictoryTooltip
                constrainToVisibleArea
                flyoutStyle={{
                  stroke: "black",
                  strokeWidth: 2,
                  fill: "black",
                }}
                style={{ fill: "white" }}
                text={({ datum }) =>
                  `${datum.gear.name} (${displayWeight(
                    datum.weight,
                    weightUnit
                  )})`
                }
              />
            }
            padAngle={3}
          />
        </g>
      </svg>
    </Box>
  );
};

export default PackPieChart;
