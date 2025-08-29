import Wrapper from "@/components/Wrapper";
import { fetchBlogPosts } from "@/helpers";
import { Card, CardBody, CardFooter, CardHeader, VStack, Text, Box, Heading, SimpleGrid } from "@chakra-ui/react";

import Image from "next/image";

import { GetStaticProps, NextPage } from "next";
import useSWR from "swr";

import { interExtraFat, interRegular } from "@/styles/theming";
import Link from "next/link";
import { BlogPostType, configType, Product } from "@/types/types";
import { withCommonStaticProps } from "@/utils/data-service";

type BlogProps = {
  blogPosts: BlogPostType[];
  featuredProduct: Product;
  config: configType;
};

const Blog: NextPage<BlogProps> = ({ blogPosts, featuredProduct, config }) => {
  if (Array.isArray(blogPosts) && blogPosts.length === 0)
    return (
      <Wrapper featuredProduct={featuredProduct} config={config}>
        <Text>No blog posts available.</Text>
      </Wrapper>
    );

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Box px={4} py={8}>
        <Heading as="h1" textAlign="center" mb={8} fontSize={{ base: "2xl", md: "3xl" }} style={interExtraFat.style}>
          Blog
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {blogPosts.map((blogPost) => (
            <Card
              key={blogPost.id}
              as={Link}
              href={"/blog/" + blogPost.attributes.slug}
              _hover={{ transform: "translateY(-5px)", transition: "transform 0.3s ease" }}
              height="100%"
            >
              <CardHeader>
                <VStack spacing={4}>
                  <Text align="center" as="h2" fontSize={{ base: "xl", md: "2xl" }} style={interExtraFat.style}>
                    {blogPost.attributes.title}
                  </Text>
                  <Box position="relative" width="100%" height={{ base: "200px", md: "250px" }}>
                    <Image
                      src={
                        blogPost.attributes.content.find((x) => x.type === "image")?.image?.url ??
                        "/placeholder-image.jpg"
                      }
                      alt={"Blogpost header image of " + blogPost.attributes.description}
                      layout="fill"
                      objectFit="cover"
                      unoptimized={true}
                    />
                  </Box>
                </VStack>
              </CardHeader>
              <CardBody>
                <Text noOfLines={3} style={interRegular.style}>
                  {
                    blogPost.attributes.content
                      .find((x) => x.type === "paragraph")
                      ?.children.find((y) => y.type === "text")?.text
                  }
                </Text>
              </CardBody>
              <CardFooter>
                <Text fontSize="sm" color="gray.500" style={interRegular.style}>
                  {"Written by " +
                    blogPost.attributes.author +
                    " on " +
                    new Date(blogPost.attributes.publishedAt).toLocaleDateString()}
                </Text>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </Wrapper>
  );
};
export default Blog;

export const getStaticProps: GetStaticProps = withCommonStaticProps(async () => {
  const queryResponse = await fetchBlogPosts();

  const blogPosts: BlogPostType[] = queryResponse.data;
  return {
    props: { blogPosts },
    revalidate: 60 * 5,
  };
});
