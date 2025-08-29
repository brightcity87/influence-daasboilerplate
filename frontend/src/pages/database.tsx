import { useEffect, useState, useCallback, useRef, useMemo, useContext } from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Input,
  Button,
  useBreakpointValue,
  Icon,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Text,
  Divider,
} from "@chakra-ui/react";
import { ChevronRightIcon, DownloadIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import Wrapper from "@/components/Wrapper";
import PaginationComponent from "@/components/Pagination";
import { DatabaseResult, ErrorResponse, Product, configType } from "@/types/types";
import { useDatabaseState, useFilterState } from "@/state/DatabaseState";
import useSWR from "swr";
import Cookies from "js-cookie";
import { fetchFilteredDatabase, exportDatabase, convertToCSV, getAllProducts, verifyToken } from "@/helpers";
import { AuthAlert } from "@/components/AuthAlert";
import VirtualizedTable from "@/components/VirtualizedTable";
import { SortingState } from "@/types/types";
import { ColumnManager } from "@/components/ColumnManager";
import { VisibilityState } from "@tanstack/react-table";
import { useTableState, DEFAULT_PAGE_SIZE } from "@/hooks/useTableState";
import { useToast } from "@chakra-ui/react";
import { useTierSettings } from "@/hooks/useTierSettings";
import { withCommonStaticProps } from "@/utils/data-service";
import { DatabaseToolbar } from "@/components/database/DatabaseToolbar";
import { DatabaseSidebar } from "@/components/database/DatabaseSidebar";
import { TierWarning } from "@/components/database/TierWarning";
import { AuthContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { ExportButton } from "@/components/database/ExportButton";
interface TierSettings {
  searchLimit: number;
  currentSearchCount: number;
  exportLimit: number;
  currentExportCount: number;
  apiAccess: "none" | "limited" | "unlimited";
  allowedDataColumns: string[];
  allowCopy: boolean;
  allowExport: boolean;
  allowedExportTypes: string[];
  currentExportLimit: number;
}

type DatabaseProps = {
  featuredProduct: Product | null;
  config: configType;
};

// Update the interface for export function
interface ExportOptions {
  filteredOptions: any;
  searchTerm: string;
  sorting: any;
  page: number;
  pageSize: number;
  type?: string; // Add type option
}

function Database({ featuredProduct, config }: DatabaseProps) {
  // Get auth context
  const { isLoggedIn, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  // State management
  const toast = useToast();
  const databaseStore = useDatabaseState();
  const filterStore = useFilterState();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [tableColumns, setTableColumns] = useState<Array<{ id: string }>>([]);
  const [isAllColumnsVisible, setIsAllColumnsVisible] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [exportCount, setExportCount] = useState(0);
  const { settings: effectiveSettings, isLoading: isLoadingTier } = useTierSettings();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Table state management
  const { loadPersistedState, persistState, updateQueryParams, getQueryParams } = useTableState("database-table");

  // Layout configuration
  const leftSidebarWidth = "250px";
  const topToolbarHeight = "60px";

  // Add demo mode detection
  const isDemoMode = useMemo(() => {
    return config.attributes.allowDemo && (router.query.demo === "true" || router.pathname === "/demo/database");
  }, [config, router]);

  // Modify the auth check to allow demo mode
  const shouldShowContent = useMemo(() => {
    if (isDemoMode) return true;
    return !authLoading && isLoggedIn;
  }, [isDemoMode, authLoading, isLoggedIn]);
  const handleColumnFilter = useCallback(
    (column: string, value: string) => {
      const newFilters = { ...filterStore.filteredOptions };

      if (value) {
        newFilters[column] = value;
        // Update filters and reset to page 1 immediately
        updateQueryParams(
          {
            [column]: value,
            page: "1",
          },
          true
        ); // Add immediate flag
      } else {
        delete newFilters[column];
        // Explicitly remove the filter and reset page immediately
        const params = {
          page: "1",
          [column]: "",
        };
        updateQueryParams(params, true); // Add immediate flag
      }

      filterStore.setFilteredOptions(newFilters);
      filterStore.setForceUpdate(true);
      databaseStore.setPage(1);
    },
    [filterStore, updateQueryParams, databaseStore]
  );

  const handleToggleAllColumns = useCallback(
    (value: boolean) => {
      setIsAllColumnsVisible(value);
      const newVisibility: VisibilityState = {};
      tableColumns.forEach((column) => {
        newVisibility[column.id] = value;
      });
      setColumnVisibility(newVisibility);
    },
    [tableColumns]
  );

  const handleClearAll = useCallback(() => {
    // Update URL first
    const clearParams = {
      search: "",
      sort: "",
      page: "1",
      ...Object.keys(filterStore.filteredOptions).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {} as Record<string, string>),
    };
    updateQueryParams(clearParams, true); // Add immediate flag

    // Then update state
    filterStore.setFilteredOptions({});
    filterStore.setSearch("");
    filterStore.setForceUpdate(true);
    setSorting([]);
    databaseStore.setPage(1);
  }, [filterStore, updateQueryParams, databaseStore]);

  // Update the search handler
  const handleSearch = useCallback(() => {
    // If searchLimit is 0 or undefined, it means unlimited searches
    if (!effectiveSettings) return;
    if (effectiveSettings?.searchLimit && effectiveSettings.currentSearchCount >= effectiveSettings.searchLimit) {
      toast({
        title: "Search limit reached",
        description: `You've reached your ${effectiveSettings.searchLimit} searches limit`,
        status: "warning",
        duration: 5000,
      });
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      filterStore.setForceUpdate(true);
    }, 500);
  }, [effectiveSettings, filterStore, toast]);

  // Update the export handler
  const handleExport = useCallback(
    async (type: string = "csv") => {
      if (!effectiveSettings?.allowExport) {
        toast({
          title: "Export not available",
          description: "Your current plan doesn't include export functionality",
          status: "warning",
          duration: 5000,
        });
        return;
      }

      if (!effectiveSettings?.allowedExportTypes?.includes(type)) {
        toast({
          title: "Export type not allowed",
          description: "This export format is not available in your current plan",
          status: "warning",
          duration: 5000,
        });
        return;
      }

      // Only check limit if it's greater than 0 (meaning there is a limit)
      if (effectiveSettings?.exportLimit > 0 && effectiveSettings.currentExportCount >= effectiveSettings.exportLimit) {
        toast({
          title: "Export limit reached",
          description: `You've reached your ${effectiveSettings.exportLimit} exports limit`,
          status: "warning",
          duration: 5000,
        });
        return;
      }

      try {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
          toast.closeAll();
          toast({
            title: "No access",
            description: "Please log in to export data",
            status: "error",
            duration: 5000,
          });
          return;
        }
        toast({
          title: "Preparing export...",
          status: "info",
          duration: null,
          isClosable: false,
        });

        const response = await exportDatabase(
          {
            filteredOptions: filterStore.filteredOptions,
            searchTerm: filterStore.searchTerm,
            sorting: sorting,
            page: 1,
            pageSize: 10000,
            type, // Add type to export options
          },
          authToken
        );
        toast.closeAll();

        if (response.type === "file") {
          const url = URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;

          // Build filename with search params and filters
          const searchParam = filterStore.searchTerm ? `_search_${filterStore.searchTerm.replace(/\s+/g, "_")}` : "";
          const filterParam = Object.keys(filterStore.filteredOptions).length > 0 ? "_filtered" : "";
          const timestamp = new Date().toISOString().split("T")[0];
          const fallbackFilename = `database_export${searchParam}${filterParam}_${timestamp}.${type}`;

          link.download = response.filename || fallbackFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({
            title: "Export successful",
            status: "success",
            duration: 3000,
          });
        } else {
          toast({
            title: "Export started",
            description: "You will receive an email when your export is ready",
            status: "success",
            duration: 5000,
          });
        }
        setExportCount((prev) => prev + 1);
      } catch (error) {
        console.error("Export error:", error);
        toast.closeAll();
        toast({
          title: "Export failed",
          description: "Please try again later",
          status: "error",
          duration: 3000,
        });
      }
    },
    [effectiveSettings, filterStore, sorting, toast]
  );

  // Update the SWR fetcher to handle demo mode
  // Create a stable key for SWR cache
  const fetchKey = useMemo(() => {
    if (!isClient || authLoading) return null;

    return JSON.stringify({
      type: isDemoMode ? "demo-database" : "database",
      page: databaseStore.page,
      pageSize: databaseStore.pageSize,
      filters: filterStore.filteredOptions,
      search: filterStore.searchTerm,
      sorting,
      forceUpdate: filterStore.forceUpdate,
    });
  }, [
    isClient,
    authLoading,
    isDemoMode,
    databaseStore.page,
    databaseStore.pageSize,
    filterStore.filteredOptions,
    filterStore.searchTerm,
    sorting,
    filterStore.forceUpdate,
  ]);

  // Create stable fetcher function
  const fetcher = useCallback(async () => {
    return fetchFilteredDatabase(
      {
        page: databaseStore.page,
        pageSize: databaseStore.pageSize,
        filteredOptions: filterStore.filteredOptions,
        searchTerm: filterStore.searchTerm,
        sorting,
      },
      isDemoMode
    );
  }, [
    databaseStore.page,
    databaseStore.pageSize,
    filterStore.filteredOptions,
    filterStore.searchTerm,
    sorting,
    isDemoMode,
  ]);

  const { data, error, isLoading } = useSWR(fetchKey, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });
  // Replace the useEffect for table columns with useMemo
  const filteredTableColumns = useMemo(() => {
    if (!data?.db?.results?.[0]?.header) {
      return [];
    }

    return data.db.results[0].header.map((h: { headername: string }) => ({ id: h.headername }));
  }, [data?.db?.results]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get initial state from URL only once on mount
  useEffect(() => {
    const { searchTerm, page, pageSize, sorting: urlSorting, filters } = getQueryParams();
    const demoFilters = { ...filters };
    if (isDemoMode) {
      delete demoFilters.demo;
    }
    // Set initial states
    if (searchTerm) filterStore.setSearch(searchTerm);
    if (page) databaseStore.setPage(page);
    if (pageSize) databaseStore.setPageSize(pageSize);
    if (Object.keys(demoFilters).length) filterStore.setFilteredOptions(demoFilters);
    if (urlSorting.length) setSorting(urlSorting);
  }, []); // Empty dependency array - run only once

  // Combined URL update effect
  useEffect(() => {
    const params: Record<string, string> = {};

    // Only add non-default values
    if (filterStore.searchTerm) params.search = filterStore.searchTerm;
    if (databaseStore.page !== 1) params.page = databaseStore.page.toString();
    if (databaseStore.pageSize !== DEFAULT_PAGE_SIZE) params.pageSize = databaseStore.pageSize.toString();
    if (sorting.length) params.sort = encodeURIComponent(JSON.stringify(sorting));

    // Add active filters
    Object.entries(filterStore.filteredOptions).forEach(([key, value]) => {
      if (value) params[key] = value.toString();
    });

    const cleanup = updateQueryParams(params);
    return cleanup;
  }, [
    filterStore.searchTerm,
    filterStore.filteredOptions,
    databaseStore.page,
    databaseStore.pageSize,
    sorting,
    updateQueryParams,
  ]);
  // Update the useEffect that sets table columns
  useEffect(() => {
    if (filteredTableColumns.length > 0) {
      setTableColumns(filteredTableColumns);
    }
  }, [filteredTableColumns]);
  // Add near the top of the component

  // Update the useEffect that handles data changes
  useEffect(() => {
    if (data?.db) {
      // Update total pages based on filtered count
      const totalItems = data.db.pagination.total || 0;
      const totalPages = data.db.pagination.pageCount || 1;
      if (databaseStore.total !== totalItems) {
        databaseStore.setTotal(totalItems);
      }
      if (databaseStore.pageCount !== totalPages) {
        databaseStore.setPageCount(totalPages);
      }

      // If current page is greater than total pages, reset to page 1
      if (databaseStore.page > totalPages && totalPages > 0) {
        databaseStore.setPage(1);
      }
    }
  }, [data?.db, databaseStore]);

  if (!isClient) return null;

  // Update auth check to allow demo mode
  if (!shouldShowContent) {
    return <AuthAlert featuredProduct={featuredProduct} config={config} />;
  }

  const results = data?.db?.results || [];
  const isNoAuthToken = error?.message === "No auth token available";
  const heightCalc = isDemoMode ? "calc(100vh - 120px)" : "calc(100vh - 80px)";
  const mobileHeightCalc = isDemoMode ? "calc(100vh - 120px)" : "calc(100vh - 80px)";
  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Flex h={[mobileHeightCalc, heightCalc]} direction="column">
        {!isDemoMode && <TierWarning settings={effectiveSettings} />}

        {/* Top Toolbar */}
        <Box h={topToolbarHeight} borderBottom="1px" borderColor="gray.200" p={2} flexShrink={0}>
          <DatabaseToolbar
            searchTerm={filterStore.searchTerm}
            onSearchChange={(value) => filterStore.setSearch(value)}
            onSearch={handleSearch}
            onClearAll={handleClearAll}
            onExport={handleExport}
            onOpenSidebar={onOpen}
            settings={effectiveSettings}
            isMobile={isMobile}
          />
        </Box>

        {/* Main Content Area */}
        <Flex flex={1} minH={0} position="relative">
          {/* Left Sidebar */}
          {!isMobile && (
            <Box
              w={isSidebarCollapsed ? "0" : leftSidebarWidth}
              bg="gray.50"
              borderRight="1px"
              borderColor="gray.200"
              transition="all 0.2s"
              position="relative"
              overflow="hidden"
              h="100%"
              flexShrink={0}
            >
              <Box p={isSidebarCollapsed ? 0 : 4} h="100%">
                <DatabaseSidebar
                  isCollapsed={isSidebarCollapsed}
                  onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  tableColumns={tableColumns}
                  isAllColumnsVisible={isAllColumnsVisible}
                  columnVisibility={columnVisibility}
                  onColumnVisibilityChange={setColumnVisibility}
                  onToggleAllColumns={handleToggleAllColumns}
                  metadata={data?.filters || []}
                  onFilter={handleColumnFilter}
                  onExport={handleExport}
                  settings={effectiveSettings}
                />
              </Box>
            </Box>
          )}

          {isMobile && (
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
              <DrawerOverlay>
                <DrawerContent bg="gray.50">
                  <DrawerCloseButton />
                  <DrawerHeader>Filters</DrawerHeader>
                  <DrawerBody>
                    <VStack spacing={4} align="stretch">
                      <ColumnManager
                        columns={tableColumns}
                        isAllColumnsVisible={isAllColumnsVisible}
                        columnVisibility={columnVisibility}
                        onColumnVisibilityChange={setColumnVisibility}
                        onToggleAllColumns={handleToggleAllColumns}
                        metadata={data?.filters || []}
                        onFilter={handleColumnFilter}
                      />
                    </VStack>
                    <Divider my={4} />
                    {effectiveSettings?.allowExport && (
                      <ExportButton
                        onExport={handleExport}
                        isDisabled={
                          !effectiveSettings?.allowExport ||
                          (effectiveSettings?.exportLimit > 0 &&
                            effectiveSettings.currentExportCount >= effectiveSettings.exportLimit)
                        }
                        settings={effectiveSettings}
                        currentCount={effectiveSettings?.currentExportCount}
                      />
                    )}
                  </DrawerBody>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          )}

          {/* Table Area */}
          <Box flex={1} minH={0} position="relative" overflow="hidden" display="flex">
            {isSidebarCollapsed && !isMobile && (
              <Box
                w="40px"
                h="100%"
                bg="gray.100"
                borderRight="1px"
                borderColor="gray.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                flexShrink={0}
              >
                <Button
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(false)}
                  colorScheme="gray"
                  mt={2}
                  variant="ghost"
                >
                  <Icon as={ChevronRightIcon} />
                </Button>
              </Box>
            )}

            {/* Table Container */}
            <Box flex={1} minH={0} overflow="hidden" display="flex" flexDirection="column">
              {isLoading ? (
                <Flex justify="center" align="center" h="100%">
                  <Text>Loading data...</Text>
                </Flex>
              ) : error ? (
                <Flex justify="center" align="center" h="100%" direction="column">
                  <Text color={isNoAuthToken ? "gray.500" : "red.500"}>
                    {isNoAuthToken ? "Validating Access" : "Error loading data"}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {isNoAuthToken ? "Loading..." : "Please try again later"}
                  </Text>
                </Flex>
              ) : !data?.db?.results?.length ? (
                <Flex justify="center" align="center" h="100%">
                  <Text>No results found</Text>
                </Flex>
              ) : (
                <Box flex={1} minH={0}>
                  <VirtualizedTable
                    tableId="database-table"
                    results={results}
                    onSort={setSorting}
                    sorting={sorting}
                    metadata={data?.filters || []}
                    onFilter={handleColumnFilter}
                    columnVisibility={columnVisibility}
                    onColumnVisibilityChange={setColumnVisibility}
                    settings={effectiveSettings || {}}
                    // allowedColumns={settings?.allowedDataColumns}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Flex>

        {/* Bottom Area - Update pagination to show total items */}
        <Box borderTop="1px" borderColor="gray.200" bg="gray.50" flexShrink={0}>
          <Box p={4} borderTop="1px" borderColor="gray.200">
            <PaginationComponent
              currentPage={databaseStore.page}
              pageCount={databaseStore.pageCount}
              decrementPage={databaseStore.decrementPage}
              incrementPage={databaseStore.incrementPage}
              setPageSize={databaseStore.setPageSize}
              totalItems={data?.db?.pagination?.total || 0}
              currentPageSize={databaseStore.pageSize}
            />
          </Box>
        </Box>
      </Flex>
    </Wrapper>
  );
}

Database.displayName = "Database";

export default Database;

export const getStaticProps = withCommonStaticProps(null, ["featuredProduct", "config"]);
