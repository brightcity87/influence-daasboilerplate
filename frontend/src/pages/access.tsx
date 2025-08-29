import Wrapper from "@/components/Wrapper";
import { Box, Button, Center, chakra, FormControl, Heading, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { setGithubAccess } from "@/helpers";
import Link from "next/link";
import { withCommonStaticProps } from "@/utils/data-service";
import { configType, Product } from "@/types/types";

const PROJECTNAME = process.env.NEXT_PUBLIC_PROJECTNAME;
const PROJECTDOMAINNAME = process.env.NEXT_PUBLIC_PROJECTDOMAINNAME;

type AccessPageProps = {
  featuredProduct: Product | null;
  config: configType;
};
const AccessPage: NextPage<AccessPageProps> = ({ featuredProduct, config }) => {
  const router = useRouter();
  const [userid, setuserid] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (router.isReady) {
      const { userid } = router.query;
      setuserid(typeof userid === "string" ? userid : null);
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userid) {
      toast({
        title: "Error",
        description: "Invalid access link",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      await setGithubAccess(githubUsername, userid);
      toast({
        title: "Success",
        description: "GitHub access requested. Please check your email for the invitation.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request GitHub access. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <chakra.section id="hero" position="relative" zIndex={20} justifyContent="center" py={"4rem"}>
        <Center>
          <VStack spacing={8} w={{ base: "90%", md: "70%", lg: "50%" }}>
            <Heading as="h1" size="xl" textAlign="center">
              {PROJECTNAME} Access
            </Heading>
            <Text textAlign="center">
              Enter your GitHub username to get an email to access the github repo. You'll receive an email from GitHub
              to confirm your access.
            </Text>
            <Box as="form" onSubmit={handleSubmit} width="100%">
              <FormControl>
                <Input
                  placeholder="Enter your GitHub username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  mb={4}
                />
                <Button type="submit" colorScheme="blue" width="100%" isLoading={isLoading}>
                  1. Request Github access
                </Button>
              </FormControl>
            </Box>
            <VStack align="start" spacing={2} width="100%">
              <Text>2. Accept the invitation in your email</Text>
              <Text>
                3. Get started with the documentation{" "}
                <Text as={Link} href={`https://${PROJECTDOMAINNAME}/docs`} color="blue.500">
                  documentation
                </Text>
              </Text>
            </VStack>
          </VStack>
        </Center>
      </chakra.section>
    </Wrapper>
  );
};

export default AccessPage;

export const getStaticProps = withCommonStaticProps();
