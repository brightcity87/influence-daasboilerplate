import { memo, useState, useCallback, useEffect } from "react";
import { Box, Text, VStack, Input, Checkbox, Divider, Select } from "@chakra-ui/react";
import { ColumnMetadata } from "@/types/types";
import { VisibilityState } from "@tanstack/react-table";
import { useFilterState } from "@/state/DatabaseState";
import { SearchIcon } from "@chakra-ui/icons";
import debounce from "@/utils/debounce";

interface ColumnManagerProps {
  columns: Array<{ id: string }>;
  isAllColumnsVisible: boolean;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (state: VisibilityState) => void;
  onToggleAllColumns: (value: boolean) => void;
  metadata: ColumnMetadata[];
  onFilter: (column: string, value: string) => void;
}

type ExpandedFilters = { [key: string]: boolean };
type LocalFilters = { [key: string]: string };
export const ColumnManager = memo(
  ({
    columns,
    isAllColumnsVisible,
    columnVisibility,
    onColumnVisibilityChange,
    onToggleAllColumns,
    metadata,
    onFilter,
  }: ColumnManagerProps) => {
    const filterStore = useFilterState();

    const [searchValue, setSearchValue] = useState("");
    const [expandedFilters, setExpandedFilters] = useState<ExpandedFilters>({});

    // Local state to track filter inputs per column (for meta type "search")
    const [localFilters, setLocalFilters] = useState<LocalFilters>(() => {
      const initial: { [key: string]: string } = {};
      columns.forEach((col) => {
        initial[col.id] = filterStore.filteredOptions[col.id] || "";
      });
      return initial;
    });

    // Effect: reset localFilters when the parent's clear event clears the filterStore
    useEffect(() => {
      const newLocalFilters: { [key: string]: string } = {};
      columns.forEach((col) => {
        newLocalFilters[col.id] = filterStore.filteredOptions[col.id] || "";
      });
      setLocalFilters(newLocalFilters);
    }, [filterStore.filteredOptions, columns]);

    // Create a debounced version of onFilter so that rapid keystrokes do not trigger multiple calls.
    const debouncedOnFilter = useCallback(
      debounce((columnId: string, value: string) => {
        onFilter(columnId, value);
      }, 800),
      [onFilter]
    );

    const filteredColumns = columns.filter((column) => column.id.toLowerCase().includes(searchValue.toLowerCase()));

    const getColumnMetadata = (columnId: string) => metadata.find((m) => m.key === columnId);

    const handleFilterChange = (columnId: string, value: string) => {
      setLocalFilters((prev: LocalFilters) => ({
        ...prev,
        [columnId]: value,
      }));
      onFilter(columnId, value);
    };

    const handleColumnToggle = useCallback(
      (columnId: string, value: boolean) => {
        onColumnVisibilityChange({
          ...columnVisibility,
          [columnId]: value,
        });
      },
      [columnVisibility, onColumnVisibilityChange]
    );

    const toggleFilter = (columnId: string) => {
      setExpandedFilters((prev: ExpandedFilters) => ({
        ...prev,
        [columnId]: !prev[columnId],
      }));
    };

    const clearFilter = (columnId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault(); // Prevent the event from bubbling up
      handleFilterChange(columnId, "");
    };

    // Set initial expanded state for columns with active filters
    useEffect(() => {
      const initialExpanded: { [key: string]: boolean } = {};
      columns.forEach((column) => {
        if (filterStore.filteredOptions[column.id]) {
          initialExpanded[column.id] = true;
        }
      });
      setExpandedFilters(initialExpanded);
    }, []);

    return (
      <VStack align="stretch" spacing={2} w="full" h="full" bg="neutral.50">
        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={1} color="neutral.700">
            Visible Columns
          </Text>
          <Input
            placeholder="Search columns..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="xs"
            mb={1}
            _placeholder={{ color: "neutral.400" }}
          />
          <Checkbox
            size="sm"
            isChecked={isAllColumnsVisible}
            onChange={(e) => onToggleAllColumns(e.target.checked)}
            mb={1}
          >
            <Text fontSize="xs">Toggle All</Text>
          </Checkbox>
          <Divider borderColor="neutral.200" />
        </Box>

        <VStack align="stretch" spacing={0} maxH={["60vh", "50vh"]} overflowY="auto">
          {filteredColumns.map((column) => {
            const meta = getColumnMetadata(column.id);
            const hasActiveFilter = filterStore.filteredOptions[column.id];
            return (
              <Box
                key={column.id}
                py={1}
                px={2}
                borderBottom="1px"
                borderColor="neutral.100"
                _hover={{ bg: "neutral.50" }}
              >
                <Checkbox
                  size="sm"
                  isChecked={columnVisibility[column.id] !== false}
                  onChange={(e) => handleColumnToggle(column.id, e.target.checked)}
                  color="neutral.600"
                >
                  <Text
                    fontSize={["sm", "xs"]}
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                    fontWeight={hasActiveFilter ? "bold" : "normal"}
                    onClick={(e) => e.stopPropagation()} // Prevent checkbox toggle when clicking text
                  >
                    {column.id.replace(/_/g, " ")}
                    {meta && columnVisibility[column.id] !== false && (
                      <>
                        <Box
                          as="span"
                          cursor="pointer"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFilter(column.id);
                          }}
                          color={hasActiveFilter ? "blue.500" : "gray.400"}
                          _hover={{ color: "blue.600" }}
                        >
                          <SearchIcon boxSize={3} />
                        </Box>
                        {hasActiveFilter && (
                          <Box
                            as="span"
                            cursor="pointer"
                            onClick={clearFilter.bind(null, column.id)}
                            color="red.500"
                            _hover={{ color: "red.600" }}
                            ml={1}
                          >
                            ✕
                          </Box>
                        )}
                      </>
                    )}
                  </Text>
                </Checkbox>

                {meta && columnVisibility[column.id] !== false && (hasActiveFilter || expandedFilters[column.id]) && (
                  <Box pl={6} mt={1}>
                    {meta.type === "select" && meta.options && (
                      <Select
                        size="xs"
                        placeholder="Filter..."
                        value={filterStore.filteredOptions[column.id] || ""}
                        onChange={(e) => handleFilterChange(column.id, e.target.value)}
                        bg="white"
                        fontSize="xs"
                      >
                        <option value="">All</option>
                        {meta.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Select>
                    )}
                    {meta.type === "search" && (
                      <Input
                        size="xs"
                        placeholder="Filter..."
                        value={localFilters[column.id] || ""}
                        onChange={(e) => {
                          setLocalFilters((prev) => ({
                            ...prev,
                            [column.id]: e.target.value,
                          }));
                          debouncedOnFilter(column.id, e.target.value);
                        }}
                        bg="white"
                        fontSize="xs"
                        _placeholder={{ color: "neutral.400" }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </VStack>
      </VStack>
    );
  }
);

ColumnManager.displayName = "ColumnManager";
