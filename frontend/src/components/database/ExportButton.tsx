import { Button, Menu, MenuButton, MenuList, MenuItem, Text, HStack } from "@chakra-ui/react";
import { DownloadIcon, ChevronDownIcon } from "@chakra-ui/icons";

interface ExportButtonProps {
  onExport: (type: string) => void;
  isDisabled: boolean;
  settings: any;
  currentCount?: number;
}

export const ExportButton = ({ onExport, isDisabled, settings, currentCount = 0 }: ExportButtonProps) => {
  if (!settings?.allowExport) return null;

  const allowedTypes = settings?.allowedExportTypes || [];
  const showTypeSelection = allowedTypes.length > 1;

  if (!showTypeSelection) {
    return (
      <HStack>
        <Button
          leftIcon={<DownloadIcon />}
          onClick={() => onExport(allowedTypes[0] || "csv")}
          colorScheme="green"
          isDisabled={isDisabled}
          w="100%"
          justifyContent="space-between"
        >
          Export
          <Text fontSize="10px" as="span">
            {settings?.exportLimit > 0 && ` (${currentCount}/${settings.exportLimit})`}
          </Text>
        </Button>
      </HStack>
    );
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<DownloadIcon />}
        colorScheme="gray"
        isDisabled={isDisabled}
      >
        Export
      </MenuButton>

      <MenuList>
        {settings?.exportLimit > 0 && (
          <Text fontSize="10px" color="gray.500" pl={3}>
            You have {settings.exportLimit - currentCount} exports left.
          </Text>
        )}
        {allowedTypes.map((type: string) => (
          <MenuItem key={type} onClick={() => onExport(type)}>
            Export as {type.toUpperCase()}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
