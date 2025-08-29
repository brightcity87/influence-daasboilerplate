import Wrapper from "@/components/Wrapper";
import {
  fetchFilterOptions,
  fetchLimitedDatabase,
  fetchTestimonials,
  getAllProducts,
  fetchPopularSearches,
  getConfig,
} from "@/helpers";
import { accent, interFat, interExtraFat, interRegular } from "@/styles/theming";
import { StarIcon, DownloadIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import React, { useState, useCallback, useRef } from "react";
import CTA from "@/components/CTA";
import {
  Container,
  Avatar,
  Box,
  Button,
  Center,
  chakra,
  CircularProgress,
  FormControl,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableContainer,
  Tag,
  Text,
  VStack,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Flex,
  Stack,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import { NextPage, GetStaticProps } from "next";
import { DatabaseResult, Product, TestimonialType, configType } from "@/types/types";

type FilterOption = {
  key: string;
  type: string;
  options: { value: string }[];
};

type PopularSearch = {
  id: number;
  attributes: {
    searchTerm: string;
    order: number;
    isActive: boolean;
  };
};

interface FreePageProps {
  testimonials: TestimonialType[];
  filterOptions: FilterOption[];
  popularSearches: string[];
  products: Product[];
  featuredProduct: Product | null;
  config: configType;
}

// Extract the SearchBar into its own memoized component.
// Passing in value, onChange, onSubmit, and isSearching as props.
const SearchBar = React.memo(
  ({ onSubmit, isSearching, value }: { onSubmit: (search: string) => void; isSearching: boolean; value: string }) => {
    const [searchState, setSearchState] = useState(value);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!searchState.trim()) {
        return;
      }
      onSubmit(searchState);
    };
    return (
      <Box as="form" onSubmit={handleSubmit} maxWidth={{ base: "100%", md: "5xl" }} w="100%">
        <FormControl>
          <InputGroup>
            <Input
              size="lg"
              type="text"
              placeholder="Search names, companies or conferences"
              borderWidth="2px"
              borderColor="brand.500"
              _hover={{ borderColor: "brand.600" }}
              _focus={{
                borderColor: "brand.700",
                boxShadow: `0 0 0 1px ${accent}`,
              }}
              fontSize="lg"
              fontWeight="medium"
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
            />
            <InputRightElement width="4.5rem" height="100%" display="flex" alignItems="center" mr={2}>
              <Button
                h="1.75rem"
                size="sm"
                type="submit"
                bg="brand.500"
                color="white"
                py={5}
                px={4}
                _hover={{ bg: "brand.600" }}
                isLoading={isSearching}
              >
                {isSearching ? <CircularProgress isIndeterminate color="white" size="20px" /> : "Search"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Box>
    );
  }
);
SearchBar.displayName = "SearchBar";

const Free: NextPage<FreePageProps> = ({
  testimonials,
  filterOptions,
  popularSearches,
  products,
  featuredProduct,
  config,
}: FreePageProps) => {
  const [searchState, setSearchState] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DatabaseResult | null>(null);

  const handleSubmit = async (search: string) => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    setSearchState(search);
    setIsSearching(true);
    try {
      const result = await fetchLimitedDatabase({ searchTerm: search });
      setSearchResults(result);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
      setIsSearching(false);
    }
  };

  const handleTagClick = async (search: string) => {
    setSearchState(search);
    setIsSearching(true);
    try {
      const result = await fetchLimitedDatabase({ searchTerm: search });
      setSearchResults(result);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
      setIsSearching(false);
    }
  };

  // -------------------------------
  // New Marketing-Driven Layout
  // -------------------------------

  // 1. HeroSection: Introduce the product benefits & key stats, plus a primary CTA.
  const HeroSection = () => (
    <chakra.section
      id="hero"
      position="relative"
      zIndex={20}
      pt={{ base: "1rem", md: "2rem" }}
      pb={{ base: "0.5rem", md: "1rem" }}
    >
      <Center mb={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 3, md: 4 }} textAlign="center" maxW="800px" px={4}>
          <Text fontSize={{ base: "1.5rem", md: "2.5rem" }} style={interExtraFat.style}>
            Find 48,679+ Verified <br /> Contacts Instantly
          </Text>
          <Text fontSize={{ base: "lg", md: "lg" }} style={interRegular.style} color="gray.600">
            Trusted by thousands. Get direct access to full contact details, verified emails and more.
          </Text>
          <HStack spacing={{ base: 4, md: 6 }}>
            <VStack spacing={1}>
              <Text style={interExtraFat.style} fontSize={{ base: "xl", md: "xl" }}>
                48K+
              </Text>
              <Text fontSize="sm">Contacts</Text>
            </VStack>
            <VStack spacing={1}>
              <Text style={interExtraFat.style} fontSize={{ base: "xl", md: "xl" }}>
                2.3K+
              </Text>
              <Text fontSize="sm">Users</Text>
            </VStack>
            <VStack spacing={1}>
              <Text style={interExtraFat.style} fontSize={{ base: "xl", md: "xl" }}>
                98%
              </Text>
              <Text fontSize="sm">Accuracy</Text>
            </VStack>
          </HStack>
          {featuredProduct ? (
            <CTA
              innerText="Get Instant Access!"
              redirect={featuredProduct.attributes.redirect}
              priceId={featuredProduct.attributes.priceId}
              mode={featuredProduct.attributes.mode}
              size="md"
            />
          ) : (
            <Button colorScheme="brand" variant="solid" size="md" px={8} isDisabled>
              Get Instant Access!
            </Button>
          )}
        </VStack>
      </Center>
      {/* Search bar and popular search buttons */}
      <Center py={["1.5rem", "2rem", "2rem"]}>
        <SearchBar value={searchState} onSubmit={handleSubmit} isSearching={isSearching} />
      </Center>
      <Center my={3}>
        <VStack spacing={2}>
          <Text fontSize="lg" color="gray.600" mb={1} fontWeight="bold">
            Popular Searches
          </Text>
          <HStack spacing={3} flexWrap="wrap" justifyContent="center">
            {popularSearches?.map((search, index) => (
              <Tag
                as="button"
                colorScheme="brand"
                size={["md", "md", "lg"]}
                key={index}
                minWidth="100px"
                justifyContent="center"
                m={1}
                cursor="pointer"
                fontSize={["md", "lg"]}
                fontWeight="bold"
                _hover={{
                  opacity: 0.8,
                  transform: "scale(1.05)",
                }}
                transition="all 0.2s"
                onClick={() => handleTagClick(search)}
              >
                {search}
              </Tag>
            ))}
          </HStack>
        </VStack>
      </Center>
    </chakra.section>
  );

  // 2. TestimonialsSection: Display social proof in its own area.
  const TestimonialsSection = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [currentIdx, setCurrentIdx] = React.useState<number>(0);
    const testimonialCount = testimonials?.length || 0;
    if (!testimonialCount) return null;

    // Reverse testimonials as before
    const reversedTestimonials = [...testimonials].reverse();

    const handlePrev = () => {
      setCurrentIdx((prev: number) => (prev === 0 ? testimonialCount - 1 : prev - 1));
    };

    const handleNext = () => {
      setCurrentIdx((prev: number) => (prev === testimonialCount - 1 ? 0 : prev + 1));
    };

    return (
      <chakra.section id="testimonials" userSelect="none">
        <Box py="1rem" position="relative">
          <Center mb={4}>
            <Text fontSize="1.8rem" style={interExtraFat.style}>
              What Our Users Say
            </Text>
          </Center>
          {isMobile ? (
            <Center position="relative">
              <Box maxW="300px" w="100%" position="relative">
                <Box
                  borderRadius="16px"
                  p={4}
                  border="2px"
                  borderColor="gray.200"
                  minHeight="280px"
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "all 0.2s ease-in-out",
                    boxShadow: "sm",
                  }}
                  bg="white"
                  mx="auto"
                >
                  <VStack spacing={3} height="100%" justifyContent="space-between" align="center">
                    <VStack spacing={2}>
                      <Avatar
                        height={70}
                        width={70}
                        name={reversedTestimonials[currentIdx].attributes.name}
                        src={
                          reversedTestimonials[currentIdx].attributes.profile_picture?.data?.[0]?.attributes?.url
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${reversedTestimonials[currentIdx].attributes.profile_picture.data[0].attributes.url}`
                            : ""
                        }
                        border="3px solid"
                        borderColor="brand.500"
                      />
                      <Text align="center" fontSize="lg" fontWeight="bold" noOfLines={1}>
                        {reversedTestimonials[currentIdx].attributes.name}
                      </Text>
                      <Text align="center" color="gray.500" fontSize="sm" fontWeight="medium" noOfLines={1}>
                        {reversedTestimonials[currentIdx].attributes.title}
                      </Text>
                    </VStack>
                    <Box>
                      <Text
                        align="center"
                        fontSize="sm"
                        color="gray.600"
                        noOfLines={3}
                        overflow="hidden"
                        wordBreak="break-word"
                        lineHeight="1.5"
                      >
                        &#34;{reversedTestimonials[currentIdx].attributes.testimonial}&#34;
                      </Text>
                    </Box>
                    <HStack spacing={1}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon key={i} color="yellow.400" w={4} h={4} />
                      ))}
                    </HStack>
                  </VStack>
                </Box>
                <IconButton
                  aria-label="Previous testimonial"
                  icon={<ArrowBackIcon />}
                  position="absolute"
                  left="-10px"
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={handlePrev}
                  variant="ghost"
                  colorScheme="brand"
                />
                <IconButton
                  aria-label="Next testimonial"
                  icon={<ArrowForwardIcon />}
                  position="absolute"
                  right="-10px"
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={handleNext}
                  variant="ghost"
                  colorScheme="brand"
                />
              </Box>
            </Center>
          ) : (
            <Center>
              <HStack spacing={6} py={2}>
                {reversedTestimonials.slice(0, 3).map((testimonial, index) => (
                  <Box
                    key={index}
                    borderRadius="16px"
                    p={4}
                    border="2px"
                    borderColor="neutral.100"
                    width="230px"
                    height="260px"
                    _hover={{
                      transform: "translateY(-5px)",
                      transition: "all 0.2s ease-in-out",
                      boxShadow: "sm",
                    }}
                    bg="white"
                    cursor="pointer"
                  >
                    <VStack height="100%" justifyContent="space-between">
                      <VStack spacing={1}>
                        <Avatar
                          height={70}
                          width={70}
                          name={testimonial.attributes.name}
                          src={
                            testimonial.attributes.profile_picture?.data?.[0]?.attributes?.url
                              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${testimonial.attributes.profile_picture.data[0].attributes.url}`
                              : ""
                          }
                          border="1px solid"
                          borderColor="neutral.100"
                        />
                        <Text align="center" fontSize="lg" fontWeight="bold" noOfLines={1}>
                          {testimonial.attributes.name}
                        </Text>
                        <Text align="center" color="gray.500" fontSize="sm" fontWeight="medium" noOfLines={1}>
                          {testimonial.attributes.title}
                        </Text>
                      </VStack>
                      <Box>
                        <Text
                          align="center"
                          fontSize="sm"
                          color="gray.600"
                          noOfLines={3}
                          overflow="hidden"
                          lineHeight="1.5"
                        >
                          {testimonial.attributes.testimonial}
                        </Text>
                      </Box>
                      <HStack spacing={1}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <StarIcon key={i} color="yellow.400" w={4} h={4} />
                        ))}
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </HStack>
            </Center>
          )}
        </Box>
      </chakra.section>
    );
  };

  // 3. SearchResultsSection: Use the existing table & overlay, with wider space and export button aligned right.
  const SearchResultsSection = () => {
    if ((searchResults && searchResults.error) || searchResults == null) {
      return (
        <Box position="relative" maxW="100%" w="100%" my={8}>
          <Box overflowX="hidden" mx="auto" py={10} minHeight="300px">
            <Box p={6} textAlign="center" zIndex={2}>
              <Box
                w={{ base: "90%", md: "600px" }}
                mx="auto"
                bg="brand.50"
                p={6}
                borderRadius="xl"
                border="2px"
                borderColor="brand.500"
              >
                <Text fontSize="1.5rem" style={interExtraFat.style} mb={2} color="brand.700">
                  You have used your daily free searches.
                </Text>
                <Text fontSize="1.1rem" style={interRegular.style} mb={4} color="gray.600">
                  Get instant access for unlimited searches!
                </Text>
                {featuredProduct ? (
                  <CTA
                    innerText="Get Instant Access!"
                    redirect={featuredProduct.attributes.redirect}
                    priceId={featuredProduct.attributes.priceId}
                    mode={featuredProduct.attributes.mode}
                  />
                ) : (
                  <Button colorScheme="brand" variant="solid" borderRadius="10px" size="lg" px={8} isDisabled>
                    Get Instant Access!
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }
    if (searchResults && searchResults.db?.results.length === 0 && searchState.trim() !== "") {
      return (
        <Box position="relative" maxW="100%" w="100%" mt={2}>
          <Box overflowX="auto" mx="auto" py={10} minHeight="300px">
            {/* The table remains styled as before but now supports horizontal scrolling on mobile */}
            <TableContainer position="relative" zIndex={1} overflowX="auto">
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                      Name
                    </Th>
                    <Th minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                      Company
                    </Th>
                    <Th minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                      Title
                    </Th>
                    <Th minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                      Email
                    </Th>
                    <Th minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                      Phone
                    </Th>
                    <Th minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                      Phone
                    </Th>
                    <Th minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                      Phone
                    </Th>
                    <Th minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                      Phone
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[...Array(3)].map((_, i) => (
                    <Tr key={i}>
                      <Td minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                        John Smith
                      </Td>
                      <Td minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                        Tech Corp
                      </Td>
                      <Td minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                        CEO
                      </Td>
                      <Td minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                        john@techcorp.com
                      </Td>
                      <Td minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                        +1234567890
                      </Td>
                      <Td minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                        +1234567890
                      </Td>
                      <Td minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                        +1234567890
                      </Td>
                      <Td minWidth="120px" maxWidth="200px" px={[2, 4]} py={2} filter="blur(4px)">
                        +1234567890
                      </Td>
                    </Tr>
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <Tr key={`blur-${i}`}>
                      {[...Array(8)].map((_, j) => (
                        <Td
                          key={`blur-cell-${j}`}
                          minWidth="120px"
                          maxWidth="200px"
                          px={[2, 4]}
                          py={2}
                          filter="blur(4px)"
                          opacity={0.3 - i * 0.05}
                        >
                          Loading...
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="linear-gradient(to bottom, transparent, white 30%)"
              p={6}
              textAlign="center"
              zIndex={2}
            >
              <Box
                w={{ base: "90%", md: "600px" }}
                mx="auto"
                bg="brand.50"
                p={6}
                borderRadius="xl"
                border="2px"
                borderColor="brand.500"
              >
                <Text fontSize="1.5rem" style={interExtraFat.style} mb={2} color="brand.700">
                  No Results Found - But We Have More!
                </Text>
                <Text fontSize="1.1rem" style={interRegular.style} mb={4} color="gray.600">
                  Get instant access to our full database of 48,679+ contacts including:
                </Text>
                <HStack spacing={4} justify="center" mb={4}>
                  <Tag size="lg" colorScheme="brand">
                    ✓ Full Contact Details
                  </Tag>
                  <Tag size="lg" colorScheme="brand">
                    ✓ Direct Emails
                  </Tag>
                  <Tag size="lg" colorScheme="brand">
                    ✓ Lifetime Updates
                  </Tag>
                </HStack>
                {featuredProduct && (
                  <CTA
                    innerText="Get Instant Access!"
                    redirect={featuredProduct.attributes.redirect}
                    priceId={featuredProduct.attributes.priceId}
                    mode={featuredProduct.attributes.mode}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }
    if (searchResults && searchResults.db?.results.length > 0 && searchState.trim() !== "") {
      return (
        <Box pointerEvents="none" position="relative" maxW="90vw" w="100%" mt={2} mx="auto">
          <Box mx="auto" py={10} minHeight="300px">
            <TableContainer pointerEvents="none" position="relative" zIndex={1} overflowX="hidden">
              {/* Export button aligned to the right */}
              <Flex pointerEvents="none" justify="flex-end" mb={4}>
                {featuredProduct && (
                  <CTA
                    innerText="Export Results"
                    redirect={featuredProduct.attributes.redirect} // Handle redirect to reg page if not logged in via CTA logic.
                    priceId={featuredProduct.attributes.priceId}
                    mode={featuredProduct.attributes.mode}
                    leftIcon={<Icon as={DownloadIcon} />}
                    size="sm"
                  />
                )}
              </Flex>
              <Table pointerEvents="none" variant="striped" size="sm" userSelect="none">
                <Thead pointerEvents="none">
                  <Tr pointerEvents="none">
                    {searchResults.db.results[0]?.header.map((header, index) => (
                      <Th key={index} pointerEvents="none" minWidth="120px" maxWidth="200px" px={[2, 4]} py={2}>
                        {header.headername}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody pointerEvents="none">
                  {searchResults.db.results.map((result, rowIndex) => (
                    <Tr key={rowIndex} pointerEvents="none">
                      {result.header.map((header, cellIndex) => (
                        <Td
                          key={cellIndex}
                          pointerEvents="none"
                          minWidth="100px"
                          maxWidth="150px"
                          px={[2, 4]}
                          py={2}
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          title={header.value}
                          color={
                            header.value?.toLowerCase().includes(searchState.toLowerCase()) ? "brand.700" : "inherit"
                          }
                        >
                          {header.value}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <Tr key={`blur-${i}`} pointerEvents="none">
                      {searchResults.db.results[0]?.header.map((_, j) => (
                        <Td
                          key={`blur-cell-${j}`}
                          pointerEvents="none"
                          minWidth="120px"
                          maxWidth="200px"
                          px={[2, 4]}
                          py={2}
                          filter="blur(4px)"
                          opacity={0.3 - i * 0.05}
                        >
                          Loading...
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              pointerEvents="none"
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="linear-gradient(to bottom, transparent, white 30%)"
              p={[2, 6]}
              textAlign="center"
              mx="auto"
              maxW={{ base: "100%", md: "600px" }}
              zIndex={2}
            >
              <Box
                pointerEvents="none"
                w={{ base: "100%", md: "600px" }}
                mx="auto"
                bg="brand.50"
                p={[4, 6]}
                borderRadius="xl"
                border="2px"
                borderColor="brand.500"
              >
                <Text
                  pointerEvents="none"
                  fontSize={{ base: "1.25rem", md: "1.5rem" }}
                  style={interExtraFat.style}
                  mb={2}
                  color="brand.700"
                >
                  Unlock {searchResults.totalEntriesInDatabase || "48,679+"} More Results
                </Text>
                <Text
                  pointerEvents="none"
                  fontSize={{ base: "0.95rem", md: "1.1rem" }}
                  style={interRegular.style}
                  mb={4}
                  color="gray.600"
                >
                  You&apos;re viewing {searchResults.db.results.length} free results. Get instant access to:
                </Text>
                <Stack
                  pointerEvents="none"
                  direction={{ base: "column", md: "row" }}
                  spacing={4}
                  justify="center"
                  mb={4}
                >
                  <Tag pointerEvents="none" size={{ base: "md", md: "lg" }} colorScheme="brand">
                    ✓ Full Contact Details
                  </Tag>
                  <Tag pointerEvents="none" size={{ base: "md", md: "lg" }} colorScheme="brand">
                    ✓ Direct Emails
                  </Tag>
                  <Tag pointerEvents="none" size={{ base: "md", md: "lg" }} colorScheme="brand">
                    ✓ Lifetime Updates
                  </Tag>
                </Stack>
                {featuredProduct && (
                  <CTA
                    innerText="Get Instant Access!"
                    redirect={featuredProduct.attributes.redirect}
                    priceId={featuredProduct.attributes.priceId}
                    mode={featuredProduct.attributes.mode}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Container maxW="8xl" mx="auto">
        {/* Hero Section with key stats, main CTA and search input */}
        <HeroSection />
      </Container>
      {/* Testimonials/Social proof */}
      <Box bg="gray.50" id="testimonials">
        <TestimonialsSection />
      </Box>
      {/* Display results or alternate CTAs based on search status */}
      <Container maxW="8xl" mx="auto" id="search-results" scrollMarginTop="100px">
        <SearchResultsSection />
      </Container>
    </Wrapper>
  );
};

export const getStaticProps: GetStaticProps<FreePageProps> = async () => {
  try {
    const [testimonialsRes, filterOptionsRes, popularSearchesRes, productsRes, configRes] = await Promise.all([
      fetchTestimonials(),
      fetchFilterOptions(),
      fetchPopularSearches(),
      getAllProducts(),
      getConfig(),
    ]);

    let featuredProduct = null;
    if ("error" in productsRes) {
      throw new Error("Error fetching products");
    }
    if (productsRes.data) {
      featuredProduct = productsRes.data.find((product: Product) => product.attributes.featured);
    }

    let config = null;
    if (!configRes.error) {
      config = configRes.data;
    }
    return {
      props: {
        testimonials: testimonialsRes.data || [],
        filterOptions: filterOptionsRes.data?.data?.attributes.filteroptions || [],
        popularSearches: popularSearchesRes.data?.map((item: PopularSearch) => item.attributes.searchTerm) || [],
        products: productsRes.data || [],
        featuredProduct: featuredProduct,
        config: config,
      } as FreePageProps,
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching static props:", error);
    return {
      props: {
        testimonials: [],
        filterOptions: [],
        popularSearches: [],
        products: [],
        featuredProduct: null,
        config: {} as configType,
      } as FreePageProps,
      revalidate: 60,
    };
  }
};

export default Free;
