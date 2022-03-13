import type { FC } from "react";

import { useState, Fragment, useContext } from "react";
import { invalidateQuery, useMutation } from "blitz";

import { HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { useToast } from "@chakra-ui/toast";
import { MenuItem, MenuList, MenuDivider } from "@chakra-ui/menu";
import {
  FaArrowRight,
  FaEdit,
  FaFileExport,
  FaFileImport,
  FaShare,
} from "react-icons/fa";
import { FcDoughnutChart } from "react-icons/fc";

import SettingsMenuButton from "app/components/settings-menu-button";
import downloadCsv from "app/helpers/download-csv";
import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";
import displayWeight from "app/helpers/display-weight";

import packShareLink from "../helpers/pack-share-link";
import packContext from "../contexts/pack-context";
import packExportCsvMutation from "../mutations/pack-export-csv-mutation";
import packOrganizerQuery from "../queries/pack-organizer-query";

import ImportPackCsvForm from "./import-pack-csv-form";

const PackSubheaderActions: FC = () => {
  const toast = useToast();
  const [importing, setImporting] = useState(false);
  const { baseWeight } = useContext(packContext);
  const { weightUnit } = useContext(userPreferencesContext);

  const { pack, showDetails, editPack, share } = useContext(packContext);

  const copyShareLink = () => {
    navigator.clipboard.writeText(packShareLink(pack.id)).then(() => {
      toast({
        title: "Share link copied.",
        description:
          "A share link for your pack has been copied to your clipboard.",
        status: "success",
      });
    });
  };

  const [exportCsv] = useMutation(packExportCsvMutation);

  const exportToCsv = async () => {
    const csv = await exportCsv({ id: pack.id });
    downloadCsv(pack.name || "pack", csv);
  };

  return (
    <Fragment>
      <ImportPackCsvForm
        packId={pack.id}
        isOpen={importing}
        onClose={() => setImporting(false)}
        onSuccess={() => {
          invalidateQuery(packOrganizerQuery);
          toast({
            title: "Your gear has been imported",
            status: "success",
          });
        }}
      />

      <HStack>
        {!share && (
          <SettingsMenuButton>
            <MenuList>
              <MenuItem icon={<FaEdit />} onClick={editPack}>
                Edit
              </MenuItem>
              <MenuItem
                icon={<FaShare />}
                command={pack.private ? "private" : ""}
                onClick={copyShareLink}
                isDisabled={pack.private}
              >
                Share
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<FaFileExport />} onClick={exportToCsv}>
                Export CSV
              </MenuItem>
              <MenuItem
                icon={<FaFileImport />}
                onClick={() => setImporting(true)}
              >
                Import CSV
              </MenuItem>
            </MenuList>
          </SettingsMenuButton>
        )}

        <Button
          size="sm"
          leftIcon={<Icon w={5} h={5} as={FcDoughnutChart} />}
          rightIcon={<Icon w={3} h={3} as={FaArrowRight} />}
          fontWeight="bold"
          variant="outline"
          colorScheme="blue"
          onClick={showDetails}
        >
          {displayWeight(baseWeight, weightUnit, true)}
        </Button>
      </HStack>
    </Fragment>
  );
};

export default PackSubheaderActions;
