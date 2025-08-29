import Wrapper from "@/components/Wrapper";
import { interExtraFat, interRegular } from "@/styles/theming";
import { Box, Button, Container, Text, VStack, chakra, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import { withCommonStaticProps } from "@/utils/data-service";
import { configType, Product } from "@/types/types";

type SuccessProps = {
  featuredProduct: Product;
  config: configType;
};

const Success: NextPage<SuccessProps> = ({ featuredProduct, config }) => {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    toast({
      title: "Payment Successful",
      description: "Thank you for your purchase!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  const handleReturnHome = () => {
    router.push("/");
  };

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Container maxW="container.xl" py={{ base: "2rem", md: "4rem" }}>
        <chakra.section position="relative" zIndex={20}>
          <VStack spacing={8} align={"center"}>
            <Text fontSize={{ base: "1.5rem", md: "2rem" }} textAlign="center" style={interExtraFat.style}>
              Payment Successful
            </Text>
            <Text fontSize={{ base: "1rem", md: "1.25rem" }} textAlign="center">
              Thank you for your purchase. Your transaction has been completed successfully. You will receive an email
              with the GitHub invitation, please check your spam folder too.
            </Text>
            <Box width="100%" maxWidth={{ base: "100%", md: "500px" }}>
              <VStack spacing={4}>
                <Button
                  onClick={handleReturnHome}
                  colorScheme="brand"
                  size="lg"
                  width="100%"
                  style={interRegular.style}
                >
                  Return to Home
                </Button>
              </VStack>
            </Box>
          </VStack>
        </chakra.section>
      </Container>
    </Wrapper>
  );
};

export default Success;

export const getStaticProps: GetStaticProps = withCommonStaticProps(null, ["featuredProduct", "config"]);
