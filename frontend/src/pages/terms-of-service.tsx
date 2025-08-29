import React from "react";
import { Box, Heading, Text, VStack, Container, Link } from "@chakra-ui/react";
import Wrapper from "@/components/Wrapper";
import { GetStaticProps } from "next";
import { withCommonStaticProps } from "@/utils/data-service";
import { configType, Product } from "@/types/types";

type TermsOfServiceProps = {
  featuredProduct: Product;
  config: configType;
};

const TermsOfService: React.FC<TermsOfServiceProps> = ({ featuredProduct, config }) => {
  const PROJECTNAME = process.env.NEXT_PUBLIC_PROJECTNAME;
  const PROJECTDOMAINNAME = process.env.NEXT_PUBLIC_PROJECTDOMAINNAME;

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl">
            Terms and Conditions for {PROJECTNAME}
          </Heading>
          <Text>Last Updated: September 26, 2023</Text>

          <Text>Welcome to {PROJECTNAME}!</Text>

          <Text>
            These Terms of Service ("Terms") govern your use of the {PROJECTNAME} website at{" "}
            <Link href={`https://${PROJECTDOMAINNAME}`} isExternal color="blue.500">
              https://{PROJECTDOMAINNAME}
            </Link>{" "}
            ("Website") and the services provided by {PROJECTNAME}. By using our Website and services, you agree to
            these Terms.
          </Text>

          <Box>
            <Heading as="h2" size="lg">
              1. Description of {PROJECTNAME}
            </Heading>
            <Text>
              {PROJECTNAME} is a 55 page PDF (video version coming soon) outlining exactly how I came up with the idea
              for my database product, closed my first subscriber, how I scaled, all the tools I use + a private
              community of builders to brainstorm with.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              2. Ownership and Usage Rights
            </Heading>
            <Text>
              When you purchase {PROJECTNAME}, you gain the right to download and use the information in the PDF to
              build your own database product. You do not have the right to resell it.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              3. User Data and Privacy
            </Heading>
            <Text>
              We collect and store user data, including name, email, and payment information, as necessary to provide
              our services. For details on how we handle your data, please refer to our{" "}
              <Link href={`https://${PROJECTDOMAINNAME}/privacy-policy`} isExternal color="blue.500">
                Privacy Policy
              </Link>
              .
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              4. Non-Personal Data Collection
            </Heading>
            <Text>
              We use web cookies to collect non-personal data for the purpose of improving our services and user
              experience.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              5. Governing Law
            </Heading>
            <Text>These Terms are governed by the laws of Ontario, Canada.</Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              6. Updates to the Terms
            </Heading>
            <Text>We may update these Terms from time to time. Users will be notified of any changes via email.</Text>
          </Box>

          <Text>
            For any questions or concerns regarding these Terms of Service, please contact via Twitter/X : @iamfra5er
          </Text>

          <Text fontWeight="bold">Thank you for the support!</Text>
        </VStack>
      </Container>
    </Wrapper>
  );
};

export default TermsOfService;

export const getStaticProps: GetStaticProps = withCommonStaticProps(null, ["featuredProduct", "config"]);
