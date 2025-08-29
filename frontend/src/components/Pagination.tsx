import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "@chakra-ui/icons";
import { HStack, Text, Flex, Select, IconButton, Tooltip } from "@chakra-ui/react";

interface PaginationComponentProps {
  currentPage: number;
  pageCount: number;
  decrementPage: () => void;
  incrementPage: () => void;
  setPageSize: (size: number) => void;
  totalItems: number;
  currentPageSize: number;
}

const PaginationComponent = ({
  currentPage,
  pageCount,
  decrementPage,
  incrementPage,
  setPageSize,
  totalItems,
  currentPageSize,
}: PaginationComponentProps) => {
  const startItem = (currentPage - 1) * currentPageSize + 1;
  const endItem = Math.min(currentPage * currentPageSize, totalItems);

  return (
    <Flex justify="space-between" align="center">
      <HStack spacing={2}>
        <Select
          value={currentPageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          size="sm"
          w={{ base: "80px", md: "120px" }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </Select>
        {/* Detailed item count shown on larger screens */}
        <Text fontSize="sm" color="gray.600" display={{ base: "none", md: "block" }}>
          {totalItems > 0 ? `${startItem}-${endItem} of ${totalItems} items` : "No items"}
        </Text>
        {/* On mobile, show an info icon with tooltip for item details */}
        <Tooltip label={totalItems > 0 ? `${startItem}-${endItem} of ${totalItems} items` : "No items"} hasArrow>
          <IconButton
            aria-label="Items info"
            icon={<InfoIcon boxSize={3} />}
            size="sm"
            variant="ghost"
            sx={{
              display: { base: "block", md: "none" },
            }}
          />
        </Tooltip>
      </HStack>

      <HStack spacing={2}>
        <IconButton
          aria-label="Previous page"
          icon={<ChevronLeftIcon />}
          onClick={decrementPage}
          isDisabled={currentPage === 1}
          size="sm"
        />
        {/* Detailed page info shown on larger screens */}
        <Text fontSize="sm" display={{ base: "none", md: "block" }}>
          Page {currentPage} of {pageCount || 1}
        </Text>
        {/* On mobile, replace page info text with an info icon and tooltip */}
        <Tooltip label={`Page ${currentPage} of ${pageCount || 1}`} hasArrow>
          <IconButton
            aria-label="Page info"
            icon={<InfoIcon boxSize={3} />}
            size="sm"
            variant="ghost"
            display={{ base: "block", md: "none" }}
          />
        </Tooltip>
        <IconButton
          aria-label="Next page"
          icon={<ChevronRightIcon />}
          onClick={incrementPage}
          isDisabled={currentPage >= pageCount}
          size="sm"
        />
      </HStack>
    </Flex>
  );
};

export default PaginationComponent;
