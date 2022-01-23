import type { ColorHues } from "@chakra-ui/react";
import type { FC } from "react";

import { useContext, useState } from "react";

import { Box } from "@chakra-ui/layout";
import { VictoryPie, VictoryTooltip } from "victory";

import displayWeight from "app/modules/common/helpers/display-weight";
import userPreferencesContext from "app/features/users/contexts/user-preferences-context";

import packContext from "../contexts/pack-context";

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
    <Box w={300}>
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
