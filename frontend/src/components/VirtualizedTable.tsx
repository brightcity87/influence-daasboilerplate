import { useMemo, useState, useCallback, useRef, useEffect, useLayoutEffect, ComponentType } from "react";
import { Box, Icon, Flex } from "@chakra-ui/react";
import { Result, ColumnMetadata } from "@/types/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  ColumnResizeMode,
  OnChangeFn,
} from "@tanstack/react-table";
import { TriangleDownIcon, TriangleUpIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useTableState } from "@/hooks/useTableState";
import useCopyBlocker from "@/hooks/useCopyBlocker";
import { FixedSizeList as _FixedSizeList, FixedSizeListProps } from "react-window";

const FixedSizeList = _FixedSizeList as ComponentType<FixedSizeListProps>;

interface VirtualizedTableProps {
  results: Result[];
  onSort: OnChangeFn<SortingState>;
  sorting: SortingState;
  metadata: ColumnMetadata[];
  onFilter: (column: string, value: string) => void;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (state: VisibilityState) => void;
  tableId: string;
  settings: any;
}

interface ColumnGroup {
  name: string;
  columns: string[];
}
const ROW_HEIGHT = 40;
const MIN_COLUMN_WIDTH = 80;
const DEFAULT_COLUMN_WIDTH = 120;

const VirtualizedTable = ({
  results,
  onSort,
  sorting,
  metadata,
  onFilter,
  columnVisibility,
  onColumnVisibilityChange,
  tableId,
  settings,
}: VirtualizedTableProps) => {
  const { loadPersistedState, persistState, updateQueryParams } = useTableState(tableId);
  const { allowCopy, maxRecords, allowedColumns } = settings;

  // Add state to track scroll position and animation
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const tableRef = useRef<HTMLDivElement>(null);

  // Add column sizing state
  const [columnSizing, setColumnSizing] = useState({});

  // Add touch feedback state
  const [activeTouchResize, setActiveTouchResize] = useState<string | null>(null);
  const touchStartXRef = useRef<number>(0);
  const columnStartWidthRef = useRef<number>(0);

  const copyBlockerConsumer = useCopyBlocker(allowCopy);

  const data = useMemo(() => {
    return results.map((result) => {
      const rowData: { [key: string]: any } = {};
      result.header.forEach((cell) => {
        rowData[cell.headername] = cell.value;
      });
      return rowData;
    });
  }, [results]);

  const columnHelper = createColumnHelper<any>();
  const columns = useMemo(() => {
    if (!results.length) return [];
    return results[0].header.map((header) => {
      return columnHelper.accessor(header.headername, {
        header: header.headername,
        enableSorting: false,
        size: DEFAULT_COLUMN_WIDTH, // Set default width
        minSize: MIN_COLUMN_WIDTH, // Set minimum width
      });
    });
  }, [results, columnHelper]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    onSortingChange: onSort,
    state: {
      sorting,
      columnVisibility,
      columnSizing, // Add column sizing state
    },
    onColumnSizingChange: setColumnSizing, // Add column sizing handler
    columnResizeMode: "onChange" as ColumnResizeMode, // Add resize mode
    enableColumnResizing: true, // Enable resizing
  });
  // Handle touch events for column resizing
  const handleTouchStart = useCallback((header: any, event: React.TouchEvent) => {
    event.stopPropagation();
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    columnStartWidthRef.current = header.getSize();
    setActiveTouchResize(header.id);
  }, []);

  const handleTouchMove = useCallback(
    (header: any, event: React.TouchEvent) => {
      if (activeTouchResize !== header.id) return;

      event.stopPropagation();
      const touch = event.touches[0];
      const diff = touch.clientX - touchStartXRef.current;
      const newWidth = Math.max(MIN_COLUMN_WIDTH, columnStartWidthRef.current + diff);

      table.setColumnSizing((old) => ({
        ...old,
        [header.id]: newWidth,
      }));
    },
    [activeTouchResize, table]
  );

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.stopPropagation();
    setActiveTouchResize(null);
  }, []);

  // Add touch feedback styles
  const getResizerStyles = useCallback(
    (headerId: string) => {
      const isResizing = activeTouchResize === headerId;
      return {
        position: "absolute" as const,
        right: 0,
        top: 0,
        height: "100%",
        width: isResizing ? "12px" : "4px", // Wider touch area when active
        background: isResizing ? "blue.500" : "transparent",
        cursor: "col-resize",
        touchAction: "none",
        transition: "all 0.2s",
        opacity: isResizing ? 1 : undefined,
        _hover: {
          width: "8px",
          background: "blue.500",
          opacity: 0.7,
        },
        _active: {
          width: "12px",
          opacity: 1,
        },
      };
    },
    [activeTouchResize]
  );

  // Check if can scroll right
  const checkScroll = useCallback(() => {
    if (tableRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // 10px threshold
    }
  }, []);

  // Memoize toggleAllColumns
  const toggleAllColumns = useCallback(
    (value: boolean) => {
      table.toggleAllColumnsVisible(value);
    },
    [table]
  );

  // Memoize table instance
  const tableInstance = useMemo(() => table, [table]);

  // Calculate available height for rows by subtracting header height
  const availableHeight = useMemo(() => {
    // Get table container element
    const tableElement = document.querySelector('[role="table"]');
    if (!tableElement) return window.innerHeight - 214; // Default height if not mounted yet

    // Get total container height
    const containerHeight = tableElement.clientHeight;

    // Get header element and calculate its height
    const headerElement = tableElement.querySelector('[role="rowgroup"]:first-child');
    const headerHeight = headerElement ? headerElement.clientHeight : 48;

    return Math.max(0, containerHeight - headerHeight);
  }, []); // Re-run when table instance changes
  const maxRows = Math.floor(availableHeight / ROW_HEIGHT);

  // Calculate total width and minimum viewport width
  const totalWidth = useMemo(() => {
    const calculatedWidth = table.getTotalSize();
    const viewportWidth = tableRef.current?.clientWidth || window.innerWidth;
    return Math.max(calculatedWidth, viewportWidth);
  }, [table]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    try {
      const row = table.getRowModel().rows[index];

      // Check if row exists
      if (!row) {
        console.error(`Row at index ${index} not found`);
        return null;
      }

      // Check if getVisibleCells exists and is a function
      if (!row.getVisibleCells || typeof row.getVisibleCells !== "function") {
        console.error(`getVisibleCells not available for row ${index}`);
        return null;
      }

      const cells = row.getVisibleCells();

      // Check if we got valid cells
      if (!Array.isArray(cells)) {
        console.error(`Invalid cells returned for row ${index}`);
        return null;
      }

      return (
        <div role="row" style={{ ...style, display: "flex", width: totalWidth }}>
          {cells.map((cell) => {
            // Validate cell data
            if (!cell || !cell.id || !cell.column?.columnDef?.cell) {
              console.error(`Invalid cell data in row ${index}`);
              return null;
            }

            return (
              <Box
                role="cell"
                key={cell.id}
                width={cell.column.getSize()}
                height={ROW_HEIGHT}
                borderRight="1px"
                borderBottom="1px"
                borderColor="neutral.200"
                p={2}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                bg={index % 2 === 0 ? "neutral.50" : "neutral.100"}
                fontSize="sm"
                color="neutral.600"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            );
          })}
          {/* Add a fill cell if needed */}
          {cells.reduce((acc, cell) => acc + cell.column.getSize(), 0) < totalWidth && (
            <Box
              flex={1}
              height={ROW_HEIGHT}
              borderBottom="1px"
              borderColor="neutral.200"
              bg={index % 2 === 0 ? "neutral.50" : "neutral.100"}
            />
          )}
        </div>
      );
    } catch (error) {
      console.error(`Error rendering row ${index}:`, error);
      return null;
    }
  };
  //

  // Handle scroll events with debouncing
  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      const handleScroll = () => {
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Update scroll position immediately
        checkScroll();

        // Only set scrolling true if not already scrolling
        if (!isUserScrolling) {
          setIsUserScrolling(true);
        }

        // Debounce the scrolling end
        scrollTimeoutRef.current = setTimeout(() => {
          setIsUserScrolling(false);
        }, 150);
      };

      tableElement.addEventListener("scroll", handleScroll, { passive: true });

      // Initial check
      checkScroll();

      return () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        tableElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [checkScroll, isUserScrolling]);

  // Check scroll on resize using ResizeObserver
  useLayoutEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      const resizeObserver = new ResizeObserver(() => {
        checkScroll();
      });

      resizeObserver.observe(tableElement);
      return () => resizeObserver.disconnect();
    }
  }, [checkScroll]);

  // Load initial state
  useEffect(() => {
    const { columnVisibility: storedVisibility, columnSizing: storedSizing } = loadPersistedState();
    if (Object.keys(storedVisibility).length) {
      onColumnVisibilityChange(storedVisibility);
    }
    if (Object.keys(storedSizing).length) {
      setColumnSizing(storedSizing);
    }
  }, [loadPersistedState, onColumnVisibilityChange]);

  // Persist state changes
  useEffect(() => {
    persistState({
      columnVisibility,
      columnSizing,
    });
  }, [persistState, columnVisibility, columnSizing]);

  // Add maxRecords check

  if (!results.length) return null;

  return (
    <Box
      h="100%"
      position="relative"
      sx={
        !allowCopy
          ? {
              userSelect: "none",
              WebkitUserSelect: "none",
              msUserSelect: "none",
              oncontextmenu: "return false",
              "&::before": {
                content: '""',
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 10000,
                pointerEvents: !allowCopy ? "none" : "auto",
              },
            }
          : {}
      }
    >
      <Box
        ref={tableRef}
        role="table"
        aria-rowcount={data.length}
        aria-colcount={columns.length}
        height="100%"
        display="flex"
        flexDirection="column"
        overflowX="auto"
        position="relative"
        sx={{
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            bg: "neutral.100",
          },
          "&::-webkit-scrollbar-thumb": {
            bg: "neutral.300",
            borderRadius: "4px",
          },
          // Add resize styles
          ".resizer": {
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "4px",
            background: "transparent",
            cursor: "col-resize",
            touchAction: "none",
            transition: "all 0.2s",
            _hover: {
              width: "8px",
              background: "blue.500",
              opacity: 0.7,
            },
            _active: {
              width: "12px",
              opacity: 1,
            },
            "&.isResizing": {
              width: "12px",
              background: "blue.500",
              opacity: 1,
            },
          },
        }}
      >
        <Box role="rowgroup">
          <Box role="row" display="flex" position="sticky" top={0} zIndex={1} width={totalWidth}>
            {table.getFlatHeaders().map((header) => (
              <Box
                role="columnheader"
                key={header.id}
                width={header.getSize()}
                height={10}
                borderRight="1px"
                borderBottom="1px"
                borderColor="neutral.200"
                fontWeight="bold"
                p={2}
                bg="neutral.100"
                color="neutral.700"
                cursor="pointer"
                userSelect="none"
                display="flex"
                alignItems="center"
                gap={1}
                fontSize="md"
                position="relative" // Add this for resizer
                _hover={{ bg: "neutral.200" }}
              >
                <Box
                  onClick={header.column.getToggleSortingHandler()}
                  flex={1}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: <Icon as={TriangleUpIcon} color="neutral.600" />,
                    desc: <Icon as={TriangleDownIcon} color="neutral.600" />,
                  }[header.column.getIsSorted() as string] ?? null}
                </Box>

                {/* Updated resize handle with touch support */}
                <Box
                  className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                  sx={getResizerStyles(header.id)}
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={(e) => handleTouchStart(header, e)}
                  onTouchMove={(e) => handleTouchMove(header, e)}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  aria-label={`Resize ${header.column.columnDef.header} column`}
                />
              </Box>
            ))}
            {/* Add header fill if needed */}
            {table.getFlatHeaders().reduce((acc, header) => acc + header.getSize(), 0) < totalWidth && (
              <Box flex={1} height={10} borderBottom="1px" borderColor="neutral.200" bg="neutral.100" />
            )}
          </Box>
        </Box>

        {/* Update cell widths in the virtualized rows */}
        <Box role="rowgroup" flex={1}>
          <FixedSizeList
            height={availableHeight}
            itemCount={Math.max(table.getRowModel().rows.length, maxRows)}
            itemSize={ROW_HEIGHT}
            width={totalWidth}
          >
            {({ index, style }) => {
              const row = table.getRowModel().rows[index];
              if (!row) {
                return (
                  <Box
                    role="row"
                    display="flex"
                    style={style}
                    borderBottom="1px"
                    borderColor="neutral.200"
                    borderRight="1px"
                    bg={index % 2 === 0 ? "neutral.50" : "neutral.100"}
                    width={totalWidth}
                  />
                );
              }
              return (
                <div role="row" style={{ ...style, display: "flex", width: totalWidth }}>
                  {row.getVisibleCells().map((cell) => (
                    <Box
                      role="cell"
                      key={cell.id}
                      width={cell.column.getSize()}
                      height={ROW_HEIGHT}
                      borderRight="1px"
                      borderBottom="1px"
                      borderColor="neutral.200"
                      p={2}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      bg={index % 2 === 0 ? "neutral.50" : "neutral.100"}
                      fontSize="sm"
                      color="neutral.600"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Box>
                  ))}
                  {/* Add fill cell if needed */}
                  {row.getVisibleCells().reduce((acc, cell) => acc + cell.column.getSize(), 0) < totalWidth && (
                    <Box
                      flex={1}
                      height={ROW_HEIGHT}
                      borderBottom="1px"
                      borderColor="neutral.200"
                      bg={index % 2 === 0 ? "neutral.50" : "neutral.100"}
                    />
                  )}
                </div>
              );
            }}
          </FixedSizeList>
        </Box>
      </Box>

      {/* Scroll Indicator with smoother transitions */}
      {canScrollRight && (
        <Box
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          width="60px"
          pointerEvents="none"
          zIndex={2}
          opacity={isUserScrolling ? 0 : 1}
          transition="opacity 0.3s ease"
        >
          {/* Gradient Overlay */}
          <Box
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            width="100%"
            bg="linear-gradient(to right, transparent, var(--chakra-colors-white) 75%)"
            opacity={0.8}
          />

          {/* Scroll Icon */}
          <Flex
            position="absolute"
            right={2}
            top="50%"
            transform="translateY(-50%)"
            bg="white"
            boxSize={8}
            borderRadius="full"
            align="center"
            justify="center"
            border="1px"
            borderColor="neutral.200"
            boxShadow="sm"
          >
            <Icon as={ChevronRightIcon} boxSize={5} color="neutral.500" animation="pulseRight 1.5s infinite" />
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default VirtualizedTable;
