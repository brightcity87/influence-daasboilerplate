import Wrapper from "@/components/Wrapper";
import { sendContactUs } from "@/helpers"; // Import the sendContactUs function
import { interExtraFat, interFat, interRegular } from "@/styles/theming";
import { configType, Product } from "@/types/types";
import { withCommonStaticProps } from "@/utils/data-service";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  VStack,
  chakra,
  useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type ContactUsProps = {
  featuredProduct: Product | null;
  config: configType;
};
const ContactUs: NextPage<ContactUsProps> = (props: ContactUsProps) => {
  const { featuredProduct, config } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA before submitting.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const data = { name, email, message, captchaToken };
      const result = await sendContactUs(data); // Send the form data to the backend

      if (result.success) {
        toast({
          title: "Message sent.",
          description: "We've received your message. We'll get back to you soon!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Reset form fields and CAPTCHA
        setName("");
        setEmail("");
        setMessage("");
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
      } else {
        throw new Error(result.message || "Failed to process contact form");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "There was an error sending your message. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Container maxW="container.xl" py={{ base: "2rem", md: "4rem" }}>
        <chakra.section id="contact-us" position="relative" zIndex={20}>
          <VStack spacing={8} align={"center"}>
            <Text fontSize={{ base: "1.5rem", md: "2rem" }} textAlign="center" style={interExtraFat.style}>
              Contact Us
            </Text>
            <Box as="form" onSubmit={handleSubmit} width="100%" maxWidth={{ base: "100%", md: "500px" }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel style={interFat.style}>Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    borderWidth="2px"
                    borderColor="brand.500"
                    _hover={{ borderColor: "brand.600" }}
                    _focus={{
                      borderColor: "brand.700",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-700)",
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel style={interFat.style}>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    borderWidth="2px"
                    borderColor="brand.500"
                    _hover={{ borderColor: "brand.600" }}
                    _focus={{
                      borderColor: "brand.700",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-700)",
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel style={interFat.style}>Message</FormLabel>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    borderWidth="2px"
                    borderColor="brand.500"
                    _hover={{ borderColor: "brand.600" }}
                    _focus={{
                      borderColor: "brand.700",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-700)",
                    }}
                  />
                </FormControl>
                <Box width="100%" overflowX="auto">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY || ""}
                    onChange={handleCaptchaChange}
                  />
                </Box>
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="100%"
                  style={interRegular.style}
                  isDisabled={!captchaToken}
                >
                  Send Message
                </Button>
              </VStack>
            </Box>
          </VStack>
        </chakra.section>
      </Container>
    </Wrapper>
  );
};

export default ContactUs;
export const getStaticProps = withCommonStaticProps(null, ["featuredProduct", "config"]);
