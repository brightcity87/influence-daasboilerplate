import React from "react";
import { Box, Heading, Text, VStack, Container, Link } from "@chakra-ui/react";
import Wrapper from "@/components/Wrapper";
import { GetStaticProps } from "next";
import { withCommonStaticProps } from "@/utils/data-service";
import { configType, Product } from "@/types/types";

type PrivacyPolicyProps = {
  featuredProduct: Product;
  config: configType;
};

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ featuredProduct, config }) => {
  const PROJECTNAME = process.env.NEXT_PUBLIC_PROJECTNAME;
  const PROJECTDOMAINNAME = process.env.NEXT_PUBLIC_PROJECTDOMAINNAME;

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl">
            Privacy Policy for {PROJECTNAME}
          </Heading>
          <Text>Last Updated: 2023-08-25</Text>

          <Text>
            Thank you for visiting {PROJECTNAME} ("we," "us," or "our"). This Privacy Policy outlines how we collect,
            use, and protect your personal and non-personal information when you use our website located at{" "}
            <Link href={`https://${PROJECTDOMAINNAME}`} isExternal color="blue.500">
              https://{PROJECTDOMAINNAME}
            </Link>{" "}
            (the "Website").
          </Text>

          <Text>
            By accessing or using the Website, you agree to the terms of this Privacy Policy. If you do not agree with
            the practices described in this policy, please do not use the Website.
          </Text>

          <Box>
            <Heading as="h2" size="lg">
              1. Information We Collect
            </Heading>
            <Heading as="h3" size="md" mt={4}>
              1.1 Personal Data
            </Heading>
            <Text>We collect the following personal information from you:</Text>
            <VStack align="start" spacing={2} pl={4}>
              <Text>
                <strong>Name:</strong> We collect your name to personalize your experience and communicate with you
                effectively.
              </Text>
              <Text>
                <strong>Email:</strong> We collect your email address to send you important information regarding your
                orders, updates, and communication.
              </Text>
              <Text>
                <strong>Payment Information:</strong> We collect payment details to process your orders securely.
                However, we do not store your payment information on our servers. Payments are processed by trusted
                third-party payment processors.
              </Text>
            </VStack>

            <Heading as="h3" size="md" mt={4}>
              1.2 Non-Personal Data
            </Heading>
            <Text>
              We may use web cookies and similar technologies to collect non-personal information such as your IP
              address, browser type, device information, and browsing patterns. This information helps us to enhance
              your browsing experience, analyze trends, and improve our services.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              2. Purpose of Data Collection
            </Heading>
            <Text>
              We collect and use your personal data for the sole purpose of order processing. This includes processing
              your orders, sending order confirmations, providing customer support, and keeping you updated about the
              status of your orders.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              3. Data Sharing
            </Heading>
            <Text>
              We do not share your personal data with any third parties except as required for order processing (e.g.,
              sharing your information with payment processors). We do not sell, trade, or rent your personal
              information to others.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              4. Children's Privacy
            </Heading>
            <Text>
              {PROJECTNAME} is not intended for children under the age of 13. We do not knowingly collect personal
              information from children. If you are a parent or guardian and believe that your child has provided us
              with personal information, please contact us at the email address provided below.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              5. Updates to the Privacy Policy
            </Heading>
            <Text>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. Any updates will be posted on this page, and we may notify you
              via email about significant changes.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              6. Contact Information
            </Heading>
            <Text>
              If you have any questions, concerns, or requests related to this Privacy Policy, you can contact us at:
            </Text>
            <Text mt={2}>
              Twitter/X:{" "}
              <Link href="https://twitter.com/iamfra5er" isExternal color="blue.500">
                @iamfra5er
              </Link>
            </Text>
          </Box>

          <Text fontWeight="bold">By using {PROJECTNAME}, you consent to the terms of this Privacy Policy.</Text>
        </VStack>
      </Container>
    </Wrapper>
  );
};

export default PrivacyPolicy;

export const getStaticProps: GetStaticProps = withCommonStaticProps(null, ["featuredProduct", "config"]);
