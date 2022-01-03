import { useState } from "react";

import { useTheme } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { VictoryPie, VictoryTooltip } from "victory";

const data = [
  {
    name: "Sleep",
    weight: 850,
    color: "blue",
    items: [
      { gear: { name: "Sleeping bag", weight: 500 } },
      { gear: { name: "Sleeping pad", weight: 300 } },
      { gear: { name: "Pillow", weight: 50 } },
    ],
  },
  {
    name: "Shelter",
    weight: 880,
    color: "purple",
    items: [
      { gear: { name: "Tent", weight: 700 } },
      { gear: { name: "Groundsheet", weight: 100 } },
      { gear: { name: "Stakes", weight: 80 } },
    ],
  },
  {
    name: "water",
    weight: 200,
    color: "teal",
    items: [
      { gear: { name: "Filter", weight: 60 } },
      { gear: { name: "Bottles", weight: 60 } },
      { gear: { name: "Bladder", weight: 80 } },
    ],
  },
];

const PieChart = () => {
  const theme = useTheme();
  const [active, setActive] = useState<string | null>(null);

  return (
    <Box bg="gray.100" borderRadius="md">
      <svg width={300} height={300}>
        <VictoryPie
          standalone={false}
          width={300}
          height={300}
          innerRadius={75}
          data={data}
          colorScale={data.map((cat) => theme.colors[cat.color][400])}
          x="name"
          y="weight"
          labelComponent={<VictoryTooltip />}
          padAngle={2}
          events={[
            {
              target: "data",
              eventHandlers: {
                onClick: (_, data) => {
                  setActive(data.datum.name);
                },
              },
            },
          ]}
        />

        {data.map((category) => (
          <g
            key={category.name}
            transform="translate(57, 57) scale(0.93)"
            visibility={active === category.name ? "visible" : "hidden"}
          >
            <VictoryPie
              data={category.items}
              colorScale={Object.values(theme.colors[category.color]).slice(1)}
              standalone={false}
              width={200}
              height={200}
              innerRadius={75}
              x="gear.name"
              y={["gear", "weight"]}
              labelComponent={<VictoryTooltip />}
              padAngle={3}
            />
          </g>
        ))}
      </svg>
    </Box>
  );
};

export default PieChart;
