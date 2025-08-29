import { useRouter } from "next/compat/router";
import { GetStaticProps } from "next";
import Head from "next/head";
import { Box, Container, VStack, Heading, Text, SimpleGrid, Icon, LinkBox, LinkOverlay } from "@chakra-ui/react";
import Wrapper from "@/components/Wrapper";
import { FaBook, FaRocket, FaCog, FaShieldAlt } from "react-icons/fa";
import { withCommonStaticProps } from "@/utils/data-service";
import { getDocCategories } from "@/utils/docs-service";
import DocLayout from "@/components/docs/DocLayout";
import { Product } from "@/types/types";

const ICONS = {
  get_started: FaRocket,
  features: FaBook,
  customization: FaCog,
  security: FaShieldAlt,
};

interface DocsHomeProps {
  config: any;
  featuredProduct: Product;
}

const DocsHome = ({ config, featuredProduct }: DocsHomeProps) => {
  const router = useRouter();
  const categories = getDocCategories();

  return (
    <Wrapper config={config} featuredProduct={featuredProduct}>
      <Head>
        <title>Documentation | DaaS Boilerplate</title>
        <meta name="description" content="Comprehensive documentation for the DaaS Boilerplate" />
      </Head>

      <DocLayout>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center" mb={8}>
            <Heading size="2xl" mb={4}>
              Documentation
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Everything you need to build and scale your data platform
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {categories.map((category) => (
              <LinkBox
                key={category.id}
                as="article"
                p={6}
                borderWidth="1px"
                rounded="lg"
                _hover={{ shadow: "md", borderColor: "blue.500" }}
                transition="all 0.2s"
              >
                <Icon as={ICONS[category.id as keyof typeof ICONS]} w={8} h={8} color="blue.500" mb={4} />
                <LinkOverlay
                  href={`/docs/${category.sections[0].id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (router) {
                      router.push(`/docs/${category.sections[0].id}`);
                    }
                  }}
                >
                  <Heading size="lg" mb={2}>
                    {category.title}
                  </Heading>
                </LinkOverlay>
                <Text color="gray.600">{category.description}</Text>
              </LinkBox>
            ))}
          </SimpleGrid>
        </VStack>
      </DocLayout>
    </Wrapper>
  );
};

export default DocsHome;

export const getStaticProps: GetStaticProps = withCommonStaticProps();
