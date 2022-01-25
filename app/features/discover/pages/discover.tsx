import type { BlitzPage } from "blitz";
import type { CategoryType, Gear } from "@prisma/client";

import { useSession } from "blitz";
import { Fragment, useState } from "react";

import { Button, Heading, HStack, useToast } from "@chakra-ui/react";
import { FcList, FcRating } from "react-icons/fc";

import SidebarLayout from "app/modules/common/layouts/sidebar-layout";
import Card from "app/modules/common/components/card";

import AddToInventoryForm from "../components/add-to-inventory-form";
import GlobalGearSearch from "../components/global-gear-search";

const DiscoverPage: BlitzPage = () => {
  const session = useSession({ suspense: false });
  const toast = useToast();

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

      <Heading mb={6} size="md">
        Discover
      </Heading>

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

DiscoverPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DiscoverPage;
