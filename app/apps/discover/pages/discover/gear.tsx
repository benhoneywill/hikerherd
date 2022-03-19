import type { BlitzPage } from "blitz";
import type { CategoryType, Gear } from "db";

import { useSession } from "blitz";
import { Fragment, useState } from "react";

import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import { Heading, HStack, Text } from "@chakra-ui/layout";
import { FcList, FcRating } from "react-icons/fc";
import { useColorModeValue } from "@chakra-ui/react";

import SidebarLayout from "app/layouts/sidebar-layout";
import Card from "app/components/card";

import AddToInventoryForm from "../../components/add-to-inventory-form";
import GlobalGearSearch from "../../components/global-gear-search";

const DiscoverGearPage: BlitzPage = () => {
  const session = useSession({ suspense: false });
  const toast = useToast();
  const textColor = useColorModeValue("gray.600", "gray.400");

  const [adding, setAdding] = useState<{
    type: CategoryType;
    gear: Gear;
  } | null>(null);

  return (
    <Fragment>
      <AddToInventoryForm
        isOpen={!!adding}
        onClose={() => setAdding(null)}
        gear={adding?.gear}
        type={adding?.type}
        onSuccess={() => {
          setAdding(null);
          toast({
            title: "Success",
            description: "The gear was added successfully.",
            status: "success",
          });
        }}
      />

      <Heading mb={4} size="md">
        Gear search
      </Heading>

      <Text mb={2} color={textColor}>
        Whenever new gear is added to hikerherd it can be found here.
      </Text>
      <Text mb={5} color={textColor}>
        The gear data is crowd-sourced by <strong>you</strong>, so the more you
        use hikerherd the better it will get!
      </Text>

      <Card>
        <GlobalGearSearch
          gearActions={(gear) => (
            <Fragment>
              {session.userId && (
                <HStack spacing={2}>
                  <Button
                    isFullWidth
                    size="sm"
                    leftIcon={<FcList />}
                    onClick={() => setAdding({ type: "INVENTORY", gear })}
                  >
                    Add to inventory
                  </Button>
                  <Button
                    isFullWidth
                    size="sm"
                    leftIcon={<FcRating />}
                    onClick={() => setAdding({ type: "WISH_LIST", gear })}
                  >
                    Add to wish list
                  </Button>
                </HStack>
              )}
            </Fragment>
          )}
        />
      </Card>
    </Fragment>
  );
};

DiscoverGearPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DiscoverGearPage;
