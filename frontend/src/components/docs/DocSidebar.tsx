import React from "react";
import { Box, VStack, Text, Link, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { getDocCategories, DocCategory, DocSection } from "@/utils/docs-service";

const DocSidebar: React.FC = () => {
  const router = useRouter();
  const categories = getDocCategories();
  const currentPath = router.asPath;

  const isActive = (path: string) => currentPath.includes(path);

  return (
    <VStack align="stretch" spacing={6} position="sticky" top="24px">
      {categories.map((category: DocCategory) => (
        <Box key={category.id}>
          <Heading size="sm" mb={3} color="gray.700">
            {category.title}
          </Heading>
          <VStack align="stretch" spacing={2}>
            {category.sections.map((section: DocSection) => (
              <Link
                key={section.id}
                as={NextLink}
                href={`/docs/${section.id}`}
                py={1}
                px={3}
                borderRadius="md"
                fontSize="sm"
                color={isActive(section.id) ? "blue.600" : "gray.600"}
                bg={isActive(section.id) ? "blue.50" : "transparent"}
                _hover={{
                  color: "blue.600",
                  bg: "blue.50",
                  textDecoration: "none",
                }}
              >
                {section.title}
              </Link>
            ))}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};

export default DocSidebar;
