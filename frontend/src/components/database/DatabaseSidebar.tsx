import { Box, VStack, Button, Icon, Divider } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import { ColumnManager } from "@/components/ColumnManager";
import { ExportButton } from "./ExportButton";
interface DatabaseSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  tableColumns: Array<{ id: string }>;
  isAllColumnsVisible: boolean;
  columnVisibility: any;
  onColumnVisibilityChange: (visibility: any) => void;
  onToggleAllColumns: (value: boolean) => void;
  metadata: any[];
  onFilter: (column: string, value: string) => void;
  onExport: () => void;
  settings: any;
}

export const DatabaseSidebar = ({
  isCollapsed,
  onToggleCollapse,
  tableColumns,
  isAllColumnsVisible,
  columnVisibility,
  onColumnVisibilityChange,
  onToggleAllColumns,
  metadata,
  onFilter,
  onExport,
  settings,
}: DatabaseSidebarProps) => {
  if (isCollapsed) return null;

  const isExportDisabled = () => {
    if (!settings?.exportLimit) return false;
    return settings.currentExportCount >= settings.exportLimit;
  };

  const showExportButton = !isExportDisabled();

  return (
    <Box position="relative" h="100%" display="flex" flexDirection="column">
      {/* Collapse button */}
      <Button
        position="absolute"
        right="-8"
        top="-2"
        size="sm"
        onClick={onToggleCollapse}
        zIndex={2}
        colorScheme="gray"
        borderRadius="0 4px 4px 0"
      >
        <Icon as={isCollapsed ? ChevronDownIcon : ChevronUpIcon} transform="rotate(-90deg)" />
      </Button>

      {/* Scrollable content area */}
      <Box flex="1" overflowY="auto" overflowX="hidden" pr="2" pb="4">
        <ColumnManager
          columns={tableColumns}
          isAllColumnsVisible={isAllColumnsVisible}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
          onToggleAllColumns={onToggleAllColumns}
          metadata={metadata}
          onFilter={onFilter}
        />
      </Box>

      {/* Fixed bottom section */}
      {showExportButton && (
        <Box pt="4" borderTop="1px" borderColor="gray.200">
          <ExportButton
            onExport={onExport}
            isDisabled={isExportDisabled()}
            settings={settings}
            currentCount={settings?.currentExportCount}
          />
        </Box>
      )}
    </Box>
  );
};
