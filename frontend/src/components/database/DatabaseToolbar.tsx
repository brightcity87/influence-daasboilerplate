import { useState, useCallback } from "react";
import { Box, HStack, Input, Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { SearchIcon, Search2Icon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ExportButton } from "./ExportButton";
import debounce from "@/utils/debounce";
interface DatabaseToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClearAll: () => void;
  onExport: () => void;
  onOpenSidebar?: () => void;
  settings: any;
  isMobile?: boolean;
}

export const DatabaseToolbar = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onClearAll,
  onExport,
  onOpenSidebar,
  settings,
  isMobile,
}: DatabaseToolbarProps) => {
  // Helper function to check if search is disabled
  const isSearchDisabled = () => {
    if (!settings?.searchLimit) return false; // 0 means unlimited
    return settings.currentSearchCount >= settings.searchLimit;
  };

  // Local state to immediately reflect the input's value
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Create a debounced version of onSearchChange to prevent rapid calls.
  const debouncedOnSearchChange = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, 800),
    [onSearchChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    debouncedOnSearchChange(e.target.value);
  };

  const handleClear = () => {
    setLocalSearch("");
    onClearAll();
  };

  const handleSearch = () => {
    if (localSearch.trim() === "") return;
    onSearchChange(localSearch);
    // onSearch();
    // setLocalSearch("");
  };

  return (
    <HStack spacing={[2, 4]} align="center">
      {isMobile && (
        <IconButton aria-label="Menu" icon={<HamburgerIcon />} size="sm" onClick={onOpenSidebar} variant="ghost" />
      )}
      <Box position="relative" flex="1">
        <Icon as={SearchIcon} position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.400" />
        <Input
          pl="10"
          size={["sm", "md"]}
          placeholder={isMobile ? "Search..." : "Search across all columns..."}
          value={localSearch}
          onChange={handleInputChange}
          isDisabled={isSearchDisabled()}
        />
      </Box>
      {isMobile ? (
        <>
          <IconButton
            aria-label="Search"
            icon={<Search2Icon />}
            onClick={onSearch}
            colorScheme="blue"
            size="sm"
            isDisabled={isSearchDisabled()}
          />
          <IconButton
            aria-label="Clear"
            icon={<CloseIcon />}
            onClick={handleClear}
            variant="outline"
            colorScheme="gray"
            size="sm"
          />
        </>
      ) : (
        <>
          <Button onClick={handleSearch} colorScheme="blue" isDisabled={isSearchDisabled()}>
            Search
          </Button>
          <Button onClick={handleClear} variant="outline" colorScheme="gray">
            Clear All
          </Button>
        </>
      )}
    </HStack>
  );
};
