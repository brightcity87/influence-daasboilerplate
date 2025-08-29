import CardComponent from "@/components/CardComponent";
import CTA from "@/components/CTA";
import { interExtraFat, interFat, interRegular } from "@/styles/theming";
import { ArrowForwardIcon, StarIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  chakra,
  Flex,
  HStack,
  Icon,
  Text,
  useTheme,
  VStack,
  Stack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { BsDatabase } from "react-icons/bs";
import Wrapper from "../components/Wrapper";
import { AuthContext } from "../pages/_app";
import { FaqResponse, FaqType, Product, configType } from "@/types/types";

const PROJECTNAME = process.env.NEXT_PUBLIC_PROJECTNAME;

type TemplateMainProps = {
  featuredProduct: Product | null;
  faqs: FaqResponse | FaqType[];
  products: Product[];
  config: configType;
};

const TemplateMain: NextPage<TemplateMainProps> = ({ featuredProduct, products, faqs, config }) => {
  const theme = useTheme();
  const darkerSection = theme.colors.sections.darker;
  const lighterSection = theme.colors.sections.lighter;
  const lighterText = theme.colors.text.lighter;
  const { isLoggedIn, loading } = useContext(AuthContext);

  let faqsData = [];
  if (Array.isArray(faqs)) {
    faqsData = faqs;
  } else {
    faqsData = faqs.data;
  }
  const showFaqs = faqsData.length > 1;

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <chakra.section id="hero" position="relative" zIndex={20} justifyContent="center" py={"4rem"}>
        <Box mx="auto" alignItems="center" display="flex" maxW={["100%", "100%", "768px", "992px", "1200px", "1300px"]}>
          <Flex
            justifyContent="center"
            alignItems="center"
            w="full"
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 10, md: 20 }}
          >
            <VStack w={{ base: "100%", md: "53%" }} align={{ base: "center", md: "start" }} spacing={8} p={4}>
              <Text
                fontSize={{ base: "2.5rem", md: "3.75rem" }}
                lineHeight={1}
                style={interExtraFat.style}
                textAlign={{ base: "center", md: "left" }}
              >
                Build a scalable and customer ready DaaS product
              </Text>

              <Text textAlign={{ base: "center", md: "left" }}>
                {PROJECTNAME} is a production ready DaaS boilerplate with everything that you need to start making money
                with your data as a service product.
              </Text>

              <Stack direction={{ base: "column", sm: "row" }} spacing={4} width="100%" align="center">
                {isLoggedIn ? (
                  <Button
                    as={Link}
                    href="/database"
                    colorScheme="brand"
                    variant="solid"
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
                    }}
                    transition="all 0.2s"
                    size={{ base: "lg", md: "xl" }}
                    height={{ base: "60px", md: "80px" }}
                    width={{ base: "100%", md: "300px" }}
                    fontSize={{ base: "20px", md: "24px" }}
                    animation="float 3s ease-in-out infinite"
                    sx={{
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0)" },
                        "50%": { transform: "translateY(-10px)" },
                      },
                    }}
                  >
                    <Icon fontSize="16px" as={BsDatabase} mr={3} />
                    Database!
                  </Button>
                ) : featuredProduct ? (
                  <CTA
                    innerText="Get Instant Access!"
                    redirect={featuredProduct.attributes.redirect}
                    priceId={featuredProduct.attributes.priceId}
                    mode={featuredProduct.attributes.mode}
                  />
                ) : null}
                {!isLoggedIn && (
                  <Button
                    colorScheme="brand"
                    variant="outline"
                    borderRadius="10px"
                    size="lg"
                    borderWidth={2}
                    width={{ base: "100%", md: "auto" }}
                    px={16}
                    href={"https://ttinfluencers.xyz"}
                    as={Link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Text style={interFat.style}>Demo</Text>
                  </Button>
                )}
              </Stack>

              <HStack justifyContent={{ base: "center", md: "flex-start" }} width="100%">
                <AvatarGroup size="md" max={7} spacing={-5}>
                  <Avatar src="avatar7.webp" borderWidth="5px" />
                  <Avatar src="avatar6.webp" borderWidth="5px" />
                  <Avatar src="avatar5.webp" borderWidth="5px" />
                  <Avatar src="avatar4.webp" borderWidth="5px" />
                  <Avatar src="avatar3.webp" borderWidth="5px" />
                  <Avatar src="avatar2.webp" borderWidth="5px" />
                  <Avatar src="avatar1.webp" borderWidth="5px" />
                </AvatarGroup>

                <VStack align="start">
                  <HStack>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Icon key={i} as={StarIcon} color={i < 5 ? "yellow.400" : "gray.300"} w={5} h={5} />
                    ))}
                  </HStack>
                  <Text>
                    <b>281</b> database builders
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            <Box display={{ base: "none", md: "block" }}>
              <Image src="/hero.png" alt="hero" width={500} height={500} />
            </Box>
          </Flex>
        </Box>
      </chakra.section>

      <chakra.section
        bgColor={darkerSection}
        id="guide"
        position="relative"
        zIndex={20}
        justifyContent="center"
        py={"4rem"}
        scrollMarginTop={70}
      >
        <Center>
          <Box maxW={["100%", "100%", "768px", "992px", "1200px", "1300px"]} px={4}>
            <VStack maxW={"55rem"} spacing={10}>
              <VStack spacing={6}>
                <Text
                  color={lighterText}
                  fontSize={{ base: "2rem", md: "3rem" }}
                  lineHeight={1.2}
                  style={interExtraFat.style}
                  align="center"
                >
                  Everything you need to launch your DaaS and make $ now!{" "}
                </Text>
                <Text color={lighterText} align="center" style={interRegular.style}>
                  Build your DaaS fast with everything you need: Authentication, Admin Panel, Multi-Tenancy, Settings,
                  Stripe Payments, Blogging, Documentation and Marketing pages{" "}
                </Text>
              </VStack>

              <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 6, md: 10 }} align="center">
                <VStack>
                  <Text fontSize="xx-large">👨‍💻</Text>
                  <Text color="whitesmoke" style={interFat.style} textAlign="center">
                    1 click deployment{" "}
                  </Text>
                </VStack>

                <ArrowForwardIcon color="whitesmoke" w={10} h={6} transform={{ base: "rotate(90deg)", md: "none" }} />

                <VStack>
                  <Text fontSize="xx-large">🗂️</Text>
                  <Text color="whitesmoke" style={interFat.style} textAlign="center">
                    Change copy and upload data{" "}
                  </Text>
                </VStack>

                <ArrowForwardIcon color="whitesmoke" w={10} h={6} transform={{ base: "rotate(90deg)", md: "none" }} />

                <VStack>
                  <Text fontSize="xx-large">🤑</Text>
                  <Text color="whitesmoke" style={interFat.style} textAlign="center">
                    Start Marketing{" "}
                  </Text>
                </VStack>
              </Stack>
            </VStack>
          </Box>
        </Center>
      </chakra.section>
      <chakra.section
        id="testimonials"
        position="relative"
        zIndex={20}
        justifyContent="center"
        py={"4rem"}
        scrollMarginTop={70}
      >
        <Center>
          <Box maxW={["100%", "100%", "768px", "992px", "1200px", "1300px"]} px={4}>
            <VStack spacing={20}>
              <Text
                fontSize={{ base: "2.5rem", md: "3.75rem" }}
                lineHeight="1.3"
                style={interExtraFat.style}
                textAlign="center"
              >
                Save{" "}
                <Box as="span" bg={darkerSection} color={lighterText} p={1} borderRadius="lg">
                  $$$ + months
                </Box>{" "}
                of dev time launching your DaaS
              </Text>
              <VStack spacing={10} width="80%">
                <Image src="/testimonial7.png" alt="testimonial7" width={400} height={400} layout="responsive" />
                <Image src="/testimonial2.png" alt="testimonial2" width={400} height={400} layout="responsive" />
              </VStack>
            </VStack>
          </Box>
        </Center>
      </chakra.section>

      <chakra.section
        id="pricing"
        position="relative"
        zIndex={20}
        justifyContent="center"
        py={"4rem"}
        bgColor={lighterSection}
        scrollMarginTop={70}
      >
        <Center>
          <Box maxW={["100%", "100%", "768px", "992px", "1200px", "1300px"]} px={4}>
            <VStack spacing={10}>
              <Text color="brand.600" style={interFat.style}>
                Pricing
              </Text>
              <Text
                whiteSpace="pre-line"
                fontSize={{ base: "2rem", md: "3rem" }}
                lineHeight={1.2}
                style={interExtraFat.style}
                align="center"
              >
                Save months of coding, launch your DaaS and make money today!
              </Text>

              {products && (
                <Flex flexWrap="wrap" justifyContent="center" gap={6}>
                  {products
                    .sort((a, b) => a.attributes.rank - b.attributes.rank)
                    .map((product) => (
                      <CardComponent key={product.id} product={product} />
                    ))}
                </Flex>
              )}
            </VStack>
          </Box>
        </Center>
      </chakra.section>

      <chakra.section id="faq" position="relative" zIndex={20} justifyContent="center" py={"4rem"} scrollMarginTop={70}>
        <Center>
          <Box maxW={["100%", "100%", "768px", "992px", "1200px", "1300px"]} px={4}>
            <Stack direction={{ base: "column", md: "row" }} align="start" spacing={5}>
              <VStack align={{ base: "center", md: "start" }} spacing={10} minW={200}>
                <Text color="brand.600" style={interFat.style}>
                  FAQ
                </Text>
                <Text
                  fontSize={{ base: "2rem", md: "3rem" }}
                  lineHeight={1.2}
                  style={interExtraFat.style}
                  textAlign={{ base: "center", md: "left" }}
                >
                  Frequently Asked Questions
                </Text>
              </VStack>
              <Accordion maxW={["100%", "100%", "768px", "992px", "1200px", "1300px"]} allowMultiple width="100%">
                {showFaqs &&
                  faqsData
                    .sort((a, b) => a.attributes.rank - b.attributes.rank)
                    .map((faq) => (
                      <AccordionItem key={faq.id}>
                        <h2>
                          <AccordionButton style={interFat.style}>
                            <Box flex="1" textAlign="left">
                              {faq.attributes.question}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Box dangerouslySetInnerHTML={{ __html: faq.attributes.answer }} />
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
              </Accordion>
            </Stack>
          </Box>
        </Center>
      </chakra.section>
    </Wrapper>
  );
};

export default TemplateMain;
