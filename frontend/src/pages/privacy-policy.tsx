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
            Privacy Policy
          </Heading>
          <Text>Last Updated: 2025-09-01</Text>

          <Text>
            Welcome to www.leadsinc.net (“Site”). This Privacy Policy explains how we collect, use, share and protect personal information processed in relation to the Site and the services that we offer (“Services”) (collectively, “Platform”) and other interactions (e.g., customer service inquiries, live chat, social media etc.) that you may have with us. It also tells you about your choices with respect to our collection, use and disclosure of your personal information.
          </Text>

          <Text fontWeight={"bold"}>
            We recommend that you read this Privacy Policy carefully as it provides important information about your personal information and your rights under the law.
          </Text>

          <Text>IF YOU ARE CALIFORNIA RESIDENT: If you are a resident of California, this entire Privacy Notice applies to you. However, please see the section titled Additional Information for California Residents below, which will inform you in detail about our information collection practices and your specific rights.</Text>
          <Text>
            If you have any questions, comments, or concerns regarding this Privacy Policy and/or our data practices, or would like to exercise your rights, do not hesitate to contact us on our contact us page.
          </Text>

          <Box>
            <Heading as="h2" size="lg">
              Changes to This Privacy Policy
            </Heading>
            <br />
            <Text>This Privacy Policy was last updated on the date indicated above. Our business and/or the Platform may change from time to time, and as a result, at times it may be necessary for Leadsinc to make changes to this Privacy Policy. Leadsinc reserves the right to update or modify this Privacy Policy at any time and from time to time without prior notice. However, if we make changes that we believe will materially impact this Privacy Policy or your rights, we will promptly notify you of those changes. We encourage you to review this Privacy Policy from time to time. Your continued use of the Platform after any changes or revisions to this Privacy Policy will indicate your agreement to the terms of any such revised Privacy Policy.</Text>

            <Heading as="h2" size="lg" mt={4}>
              Children’s Privacy
            </Heading>
            <br />
            <Text>
              Leadsinc does not knowingly collect information from children under the age of 16. If you are under the age of 16, please do not submit any personal data through the Platform. We encourage parents and legal guardians to monitor their children’s Internet usage and to help enforce our Privacy Policy by instructing their children never to provide personal data on our Platform without their permission.
              <br />
              If you have reason to believe that a child under the age of 16 has provided personal data to Leadsinc through the Platform, please contact us and we will endeavor to delete that information from our databases.
            </Text>

            <Heading as="h2" size="lg" mt={4}>
              To Whom Does This Policy Apply
            </Heading>
            <br />
            <Text>
              Throughout this Privacy Policy, “personal information” (or “personal data” as used interchangeably) refers to any information that is unique to an individual, such as name, address, email address, phone number, IP address and other information that can reasonably identify an individual. This Privacy Policy applies to personal information (that we collect, store, disclose or otherwise process) from or about:
              <br />
              <br />
              Site Visitors – this includes visitors to our Site, including those who do not register for our Services.
              <br />
              Customers – this includes any individual who registers individually or on behalf of an entity or organization in order to use the Services, whether as part of a free trial or paid subscription.
              <br />
              Business Profiles – our business is to help people connect professionally, and for this we collect and compile business information about individuals and their companies. As such, we store and process personal information to create Business Profiles of individuals as part of our Services. Please see below for more information on how this information is collected.
            </Text>


            <Heading as="h2" size="lg" mt={4}>
              Personal Information That We Collect
            </Heading>
            <br />
            <Text>
              What personal information we collect and process depends on a number of factors. As explained in more detail below, we process personal information that we receive directly from you when you provide it to us, such as when you sign up for our Services, or indirectly, such as through automated technologies (e.g., cookies) or from third parties. We also collect information for Business Profiles in a variety of ways as explained below.
            </Text>

            <Heading as="h2" size="lg" mt={4}>
              Information We Collect Directly From You
            </Heading>
            <br />
            <Text>
              You can generally visit our Site without having to submit any personal information. However, if you wish to use our Services, you will be asked to provide information about yourself.
            </Text>

            <Heading as="h2" size="lg" mt={4}>
              Contacting Us
            </Heading>
            <br />
            <Text>
              If you contact us through our “Contact Us” form on the Site or via the chat feature, we process any personal information contained in those communications, including name, contact information, company and any other information that you submit to us.
            </Text>

            <Heading as="h2" size="lg" mt={4}>
              Signing up for our Services
            </Heading>
            <br />
            <Text>
              If you sign up for our Services, whether as a free registration or paid subscription, we will collect personal information as follows:

              First and last name
              Company name
              Email address
              Password
              Location (Country/State/Zip Code)
              Phone number
              Billing address
              If you are a Customer, we use PCI-compliant third-party processors, as explained in Payment Processing. Payment information is processed by our payment service providers, and we receive a confirmation of payment, which we then associate with your account and any relevant transactions.
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
          </Box>

          <Text fontWeight="bold">By using {PROJECTNAME}, you consent to the terms of this Privacy Policy.</Text>
        </VStack>
      </Container>
    </Wrapper>
  );
};

export default PrivacyPolicy;

export const getStaticProps: GetStaticProps = withCommonStaticProps(null, ["featuredProduct", "config"]);
