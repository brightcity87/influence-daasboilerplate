import BlockRendererClient from "@/components/BlockRendererClient";
import Wrapper from "@/components/Wrapper";
import { fetchBlogPosts, getConfig } from "@/helpers";
import { interExtraFat } from "@/styles/theming";
import { BlogPostType, configType, Product } from "@/types/types";
import { Box, Card, chakra, Flex, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { getAllProducts } from "@/helpers";
type BlogPostProps = {
  res: BlogPostType;
  featuredProduct: Product | null;
  config: configType;
};
const BlogPost = (props: BlogPostProps) => {
  const { res, featuredProduct, config } = props;

  const { data, error, isLoading } = useSWR<any>(["blogs"], () => fetchBlogPosts(), {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    refreshInterval: 10000, // Refresh every 10 seconds
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  if (!data) return <div>No data...</div>;
  const blogPosts: BlogPostType[] = data.data;

  // Find the current post in the fetched data
  const currentPost = blogPosts.find((post) => post.attributes.slug === res.attributes.slug);

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Flex direction={{ base: "column", md: "row" }} px={{ base: 4, md: 8, lg: 16 }} py={8}>
        <Box flex={{ base: "1", md: "3" }} mb={{ base: 8, md: 0 }} mr={{ base: 0, md: 8 }}>
          <Text fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} style={interExtraFat.style} as="h1" mb={4}>
            {currentPost?.attributes.title || res.attributes.title}
          </Text>
          <Text mb={6}>
            {"Written by " +
              (currentPost?.attributes.author || res.attributes.author) +
              " at " +
              new Date(currentPost?.attributes.publishedAt || res.attributes.publishedAt).toDateString()}
          </Text>
          <BlockRendererClient content={currentPost?.attributes.content || res.attributes.content} />
        </Box>

        <chakra.aside
          flex="1"
          position={{ base: "static", md: "sticky" }}
          top={{ base: 0, md: "120px" }}
          alignSelf={{ base: "auto", md: "flex-start" }}
        >
          <Text fontSize={{ base: "lg", md: "xl" }} style={interExtraFat.style} as="h2" mb={4}>
            Recent posts
          </Text>
          <VStack spacing={4} align="stretch">
            {blogPosts.map((blogPost) => (
              <Card
                key={blogPost.attributes.slug}
                as={Link}
                href={"/blog/" + blogPost.attributes.slug}
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
              >
                <Image
                  src={
                    blogPost.attributes.content.find((x) => x.type === "image")?.image.url ?? "/placeholder-image.jpg"
                  }
                  alt={"Blogpost header image of " + blogPost.attributes.description}
                  width={200}
                  height={100}
                  objectFit="cover"
                  unoptimized={true}
                />
                <VStack align="stretch" p={3}>
                  <Text fontSize="md" fontWeight="bold" style={interExtraFat.style}>
                    {blogPost.attributes.title}
                  </Text>
                  <Text fontSize="sm">
                    {"Written by " +
                      blogPost.attributes.author +
                      " at " +
                      new Date(blogPost.attributes.publishedAt).toDateString()}
                  </Text>
                </VStack>
              </Card>
            ))}
          </VStack>
        </chakra.aside>
      </Flex>
    </Wrapper>
  );
};

export default BlogPost;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;

    // Fetch all blog posts
    const blogPosts = await fetchBlogPosts(true);
    const products = await getAllProducts();
    let featuredProduct: Product | null = null;
    let allProducts: Product[] = [];
    if ("error" in products) {
      featuredProduct = null;
    } else {
      featuredProduct = products.data.find((product: Product) => product.attributes.featured) || products.data[0];
      allProducts = products.data;
    }

    // Find the specific blog post by slug
    const post = blogPosts.data.find((post: BlogPostType) => post.attributes.slug === slug);

    if (!post) {
      return {
        notFound: true,
      };
    }

    const configDataCall = await getConfig();
    let config = null;
    if (configDataCall?.data) {
      config = configDataCall.data;
    }

    return {
      props: {
        featuredProduct,
        res: post,
        config: config,
      },
      revalidate: 60 * 10, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Fetch all blog posts
    const blogPosts = await fetchBlogPosts(true);

    const paths = blogPosts.data.map((post: BlogPostType) => ({
      params: { slug: post.attributes.slug },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};
