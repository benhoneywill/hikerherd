import type { FC } from "react";
import type { CategoryType } from "db";

import { useState } from "react";
import { invalidateQuery, useMutation } from "blitz";

import { HStack } from "@chakra-ui/layout";
import { MenuItem, MenuList } from "@chakra-ui/menu";
import { FaFileExport, FaFileImport } from "react-icons/fa";
import { FcList, FcRating } from "react-icons/fc";
import { useToast } from "@chakra-ui/react";

import PackPicker from "app/features/packs/components/pack-picker";
import Subheader from "app/modules/common/components/subheader";
import SettingsMenuButton from "app/modules/common/components/settings-menu-button";
import downloadCsv from "app/modules/common/helpers/download-csv";

import inventoryCsvMutation from "../mutations/inventory-csv-mutation";
import inventoryQuery from "../queries/inventory-query";

import ImportInventoryCsvForm from "./import-inventory-csv-form";

type InventorySubheaderProps = {
  type: CategoryType;
};

const InventorySubheader: FC<InventorySubheaderProps> = ({ type }) => {
  const title = type === "INVENTORY" ? "Inventory" : "Wish list";
  const icon = type === "INVENTORY" ? FcList : FcRating;

  const toast = useToast();
  const [importing, setImporting] = useState(false);

  const [exportCsv] = useMutation(inventoryCsvMutation);

  const exportToCsv = async () => {
    const csv = await exportCsv({ type });
    downloadCsv(type.toLowerCase(), csv);
  };

  return (
    <Subheader>
      <ImportInventoryCsvForm
        type={type}
        isOpen={importing}
        onClose={() => setImporting(false)}
        onSuccess={() => {
          invalidateQuery(inventoryQuery);
          toast({
            title: "Your gear has been imported",
            description:
              "Your new gear has been imported, you'll find it at the end of your inventory.",
            status: "success",
          });
        }}
      />

      <HStack justifyContent="space-between">
        <PackPicker title={title} icon={icon} />

        <SettingsMenuButton>
          <MenuList>
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
      </HStack>
    </Subheader>
  );
};

export default InventorySubheader;
