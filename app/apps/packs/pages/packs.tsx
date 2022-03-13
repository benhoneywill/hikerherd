import type { BlitzPage } from "blitz";

import { useMutation, useRouter, Routes, useQuery } from "blitz";
import { Fragment, useState } from "react";

import { Button, IconButton } from "@chakra-ui/button";
import { Heading, SimpleGrid, HStack, Text, Stack } from "@chakra-ui/layout";
import { MdDelete } from "react-icons/md";
import { useToast } from "@chakra-ui/toast";
import { Tooltip } from "@chakra-ui/tooltip";
import { useColorModeValue } from "@chakra-ui/react";

import SidebarLayout from "app/layouts/sidebar-layout";
import ConfirmModal from "app/components/confirm-modal";

import packsQuery from "../queries/packs-query";
import PackForm from "../components/pack-form";
import deletePackMutation from "../mutations/delete-pack-mutation";
import PackCard from "../components/pack-card";

const PacksPage: BlitzPage = () => {
  const router = useRouter();
  const toast = useToast();
  const textColor = useColorModeValue("gray.600", "gray.400");
  const [addingNewPack, setAddingNewPack] = useState(false);
  const [deletingPack, setDeletingPack] = useState<string | null>(null);

  const [packs, { refetch }] = useQuery(packsQuery, {});
  const [deletePack] = useMutation(deletePackMutation);

  return (
    <Fragment>
      <HStack mb={4} justify="space-between">
        <Heading size="md">Packs</Heading>

        {packs.length !== 0 && (
          <Button
            as="a"
            colorScheme="green"
            onClick={() => setAddingNewPack(true)}
            size="sm"
            cursor="pointer"
          >
            New pack
          </Button>
        )}
      </HStack>

      <PackForm
        isOpen={addingNewPack}
        onClose={() => setAddingNewPack(false)}
        onSuccess={(pack) => {
          router.push(Routes.PackPage({ packId: pack.id }));
        }}
      />

      {packs.length === 0 && (
        <Stack spacing={5}>
          <Text color={textColor}>You have not created any packs yet</Text>
          <div>
            <Button
              as="a"
              colorScheme="green"
              onClick={() => setAddingNewPack(true)}
              cursor="pointer"
            >
              Create your first pack
            </Button>
          </div>
        </Stack>
      )}

      {packs.length >= 1 && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} mt={2}>
          {packs.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              actions={
                <Tooltip label="Delete this pack">
                  <IconButton
                    size="sm"
                    icon={<MdDelete />}
                    aria-label="Delete"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => setDeletingPack(pack.id)}
                  />
                </Tooltip>
              }
            />
          ))}
        </SimpleGrid>
      )}

      <ConfirmModal
        isOpen={!!deletingPack}
        onClose={() => setDeletingPack(null)}
        title="Delete this pack"
        description="Are you sure? This will also delete the categories and gear inside of the pack."
        onConfirm={async () => {
          if (deletingPack) {
            await deletePack({ id: deletingPack });
            refetch();
            toast({
              title: "The pack was deleted",
              description:
                "Your pack was deleted along with the categories and gear inside.",
              status: "success",
            });
          }
        }}
      />
    </Fragment>
  );
};

PacksPage.authenticate = { redirectTo: Routes.LoginPage() };
PacksPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default PacksPage;
