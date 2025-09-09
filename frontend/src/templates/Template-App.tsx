import Wrapper from "@/components/Wrapper";
import { fetchTestimonials, getAllFaqs, getAllProducts } from "@/helpers";
import { interExtraFat, interFat, interRegular } from "@/styles/theming";
import { StarIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Center,
  chakra,
  Flex,
  HStack,
  Icon,
  ListItem,
  SimpleGrid,
  Skeleton,
  Text,
  UnorderedList,
  useTheme,
  VStack,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { BsDatabase } from "react-icons/bs";

import Image from "next/image";

import { NextPage } from "next";
import useSWR from "swr";

import Link from "next/link";

import CTA from "@/components/CTA";
import CardComponent from "@/components/CardComponent";
import { configType, FaqResponse, FaqType, Product, TestimonialResponse, TestimonialType } from "@/types/types";
import { AuthContext } from "../pages/_app";

export const CheckMarkIcon = () => (
  <>
    <Icon
      boxSize={5}
      mt={1}
      mr={2}
      color="blue.500"
      _dark={{
        color: "blue.300",
      }}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      ></path>
    </Icon>
  </>
);

type TemplateAppProps = {
  featuredProduct: Product | null;
  faqs: FaqResponse | FaqType[];
  testimonials: TestimonialResponse | TestimonialType[];
  products: Product[];
  config: configType;
};

const TemplateApp: NextPage<TemplateAppProps> = ({
  featuredProduct,
  faqs,
  testimonials,
  products,
  config,
}: TemplateAppProps) => {
  const theme = useTheme();

  const { isLoggedIn, loading } = useContext(AuthContext);
  let showTestimonials = false;
  let testimonialsData = [];
  let faqsData = [];
  if (Array.isArray(testimonials)) {
    showTestimonials = testimonials.length > 1;
    testimonialsData = testimonials;
  } else {
    showTestimonials = Array.isArray(testimonials.data) && testimonials.data.length > 1;
    testimonialsData = testimonials.data;
  }
  let showFaqs = false;
  if (Array.isArray(faqs)) {
    showFaqs = faqs.length > 1;
    faqsData = faqs;
  } else {
    showFaqs = Array.isArray(faqs.data) && faqs.data.length > 1;
    faqsData = faqs.data;
  }
  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <chakra.section id="hero" position="relative" zIndex={20} justifyContent="center" py={"4rem"}>
        <Center>
          <VStack
            w={{
              base: "95%",
              sm: "90%",
              md: "80%",
              lg: "70%",
              xl: "65%",
              "2xl": "50%",
            }}
            spacing={8}
            p={4}
            align={"center"}
          >
            <Text
              align={"center"}
              fontSize={{ base: "2xl", md: "3xl", lg: "3.75rem" }}
              lineHeight={1.2}
              style={interExtraFat.style}
            >
              Is Your Team Wasting Hours Prospecting Instead of Closing New Partners?
            </Text>

            <Text textAlign="center">We’ve already done the research—just plug into the data, reach out, and start closing.</Text>

            <Stack direction={{ base: "column", md: "row" }} spacing={4} width="100%" justifyContent="center">
              {loading && <Skeleton height="40px" width="200px" />}

              {!loading && isLoggedIn && (
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
                  size={{ base: "md", md: "lg", lg: "xl" }}
                  height={{ base: "60px", md: "70px", lg: "80px" }}
                  width={{ base: "100%", md: "250px", lg: "300px" }}
                  fontSize={{ base: "18px", md: "20px", lg: "24px" }}
                  animation="float 3s ease-in-out infinite"
                  sx={{
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0)" },
                      "50%": { transform: "translateY(-10px)" },
                    },
                  }}
                >
                  <Icon size="xl" as={BsDatabase} mr={3} />
                  Database!
                </Button>
              )}

              {!loading && !isLoggedIn && !config.attributes.onlyDemo && (
                <>
                  {featuredProduct && (
                    <CTA
                      innerText="Get Instant Access!"
                      redirect={featuredProduct.attributes.redirect}
                      priceId={featuredProduct.attributes.stripe}
                    />
                  )}

                  {!featuredProduct && (
                    <Button
                      colorScheme="brand"
                      variant="solid"
                      borderRadius="10px"
                      size={{ base: "md", md: "lg" }}
                      px={8}
                      isDisabled
                    >
                      <Text style={interFat.style}>Please configure a featured product in your admin panel</Text>
                    </Button>
                  )}

                  <Button
                    colorScheme="brand"
                    borderRadius="10px"
                    size={{ base: "md", md: "lg" }}
                    width={{ base: "100%", md: "auto" }}
                    px={{ base: 8, md: 20 }}
                    href={"/free"}
                    as={Link}
                    variant={"outline"}
                  >
                    <Text style={interFat.style}>Demo</Text>
                  </Button>
                </>
              )}

              {!loading && !isLoggedIn && config.attributes.onlyDemo && (
                <>
                  <Button
                    as={Link}
                    href="/database?demo=true"
                    colorScheme="brand"
                    variant="solid"
                    borderRadius="10px"
                    size={{ base: "md", md: "lg" }}
                    width={{ base: "100%", md: "auto" }}
                    px={{ base: 8, md: 20 }}
                  >
                    <Text style={interFat.style}>Search Now</Text>
                  </Button>
                  <Popover placement="bottom" trigger="hover">
                    <PopoverContent>
                      <PopoverBody>
                        This is a demo project. You already have access. Just click the Database button!
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </Stack>
            <Box width="100%" height="auto" position="relative">
              <Image src="/Amattendees_hero.png" alt="hero" layout="responsive" width={1000} height={1000} />
            </Box>

            <Stack direction={{ base: "column", md: "row" }} spacing={4} width="100%" justifyContent="center">
              {showTestimonials ? (
                <>
                  <Box borderRadius={"21px"} p={5} border="2px" width={{ base: "100%", md: "45%" }}>
                    <VStack>
                      <Avatar
                        height={90}
                        width={90}
                        name={testimonialsData[0].attributes.name}
                        src={
                          testimonialsData[0].attributes.profile_picture?.data?.[0]?.attributes?.url
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${testimonialsData[0].attributes.profile_picture.data[0].attributes.url}`
                            : ""
                        }
                      />
                      <Text align={"center"} style={interExtraFat.style}>
                        {testimonialsData[0].attributes.name}
                      </Text>
                      <Text align={"center"} style={interFat.style}>
                        {testimonialsData[0].attributes.testimonial}
                      </Text>
                      <Text align={"center"} style={interRegular.style}>
                        {testimonialsData[0].attributes.title}
                      </Text>
                      <HStack>
                        {Array.from({ length: 5 }, (_, i) => (
                          <StarIcon key={i} color="yellow.500" />
                        ))}
                      </HStack>
                    </VStack>
                  </Box>
                  <Box borderRadius={"21px"} p={5} border="2px" width={{ base: "100%", md: "45%" }}>
                    <VStack>
                      <Avatar
                        height={90}
                        width={90}
                        name={testimonialsData[1].attributes.name}
                        src={
                          testimonialsData[1].attributes.profile_picture?.data?.[0]?.attributes?.url
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${testimonialsData[1].attributes.profile_picture.data[0].attributes.url}`
                            : ""
                        }
                      />
                      <Text align={"center"} style={interExtraFat.style}>
                        {testimonialsData[1].attributes.name}
                      </Text>
                      <Text align={"center"} style={interFat.style}>
                        {testimonialsData[1].attributes.testimonial}
                      </Text>
                      <Text align={"center"} style={interRegular.style}>
                        {testimonialsData[1].attributes.title}
                      </Text>
                      <HStack>
                        {Array.from({ length: 5 }, (_, i) => (
                          <StarIcon key={i} color="yellow.500" />
                        ))}
                      </HStack>
                    </VStack>
                  </Box>
                </>
              ) : (
                ""
              )}
            </Stack>

            <chakra.section id="companies" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text
                py={5}
                as={"p"}
                align={"center"}
                fontSize={{ base: "xl", md: "xx-large" }}
                style={interRegular.style}
              >
                TARGETED LEADS READY TO INCREASE THE REVENUE FOR YOUR BUSINESS
              </Text>

              <Box width="100%" height="auto" position="relative">
                <Image
                  src="/target.png"
                  alt="hero"
                  layout="responsive"
                  width={2000}
                  height={2000}
                />
              </Box>
            </chakra.section>

            <chakra.section id="how-it-works" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text py={5} as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                How To Increase Your Revenue
              </Text>

              <Stack direction={{ base: "column", md: "row" }} spacing={10} align={"start"}>
                <VStack w={{ base: "100%", md: "33%" }} p={4} align={"start"}>
                  <Text fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                    1. Sign Up
                  </Text>
                  <Text fontSize={{ base: "md", md: "large" }}>
                    All you have to do is click the “Get Started” button and enter your email.
                  </Text>
                </VStack>

                <VStack w={{ base: "100%", md: "33%" }} p={4} align={"start"}>
                  <Text fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                    2. Get Instant Access to Database
                  </Text>
                  <Text fontSize={{ base: "md", md: "large" }}>
                    Get instant access to our carefully curated database of leads + monthly updates.
                  </Text>
                </VStack>

                <VStack w={{ base: "100%", md: "33%" }} p={4} align={"start"}>
                  <Text fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                    3. Close New Partners Today
                  </Text>
                  <Text fontSize={{ base: "md", md: "large" }}>
                    Now that you have access to the database, find, contact and close new business!
                  </Text>
                </VStack>
              </Stack>
            </chakra.section>

            <chakra.section id="testimonials" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text py={5} as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                Our subscribers have closed thousands of deals using our leads
              </Text>

              <VStack spacing={8} align="center">
                {testimonialsData &&
                  testimonialsData.map((testimonial: any, index: any) => {
                    if (index < 6)
                      return (
                        <Box key={index} p={6} width="100%" maxWidth="700px">
                          <VStack align="center">
                            <Avatar
                              height={90}
                              width={90}
                              name={testimonial.attributes.name}
                              src={
                                testimonial.attributes.profile_picture?.data?.[0]?.attributes?.url
                                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${testimonial.attributes.profile_picture.data[0].attributes.url}`
                                  : ""
                              }
                            />
                            <Text align={"center"} style={interExtraFat.style}>
                              {testimonial.attributes.name}
                            </Text>
                            <Text align={"center"} style={interFat.style}>
                              {testimonial.attributes.testimonial}
                            </Text>
                            <Text align={"center"} style={interRegular.style}>
                              {testimonial.attributes.title}
                            </Text>
                            <HStack>
                              {Array.from({ length: 5 }, (_, i) => (
                                <StarIcon key={i} color="yellow.500" />
                              ))}
                            </HStack>
                          </VStack>
                        </Box>
                      );
                  })}
              </VStack>
            </chakra.section>

            <Box width="100%" height="auto" position="relative">
              <Image
                src="/companyLogo.png"
                alt="company-logos"
                layout="responsive"
                width={2000}
                height={2000}
              />
            </Box>

            <chakra.section id="strategies" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                Simplify your prospecting
              </Text>
              <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interRegular.style}>
                Find, contact, and close your ideal partners with our easy-to-use database.
              </Text>

              <VStack py={20} spacing={10}>
                <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 10, md: 20 }} alignItems="center">
                  <VStack align={"start"} width={{ base: "100%", md: "50%" }}>
                    <Text
                      py={4}
                      as={"p"}
                      align={"start"}
                      fontSize={{ base: "xl", md: "xx-large" }}
                      style={interFat.style}
                    >
                      Find Leads
                    </Text>
                    <Text as={"p"} align={"start"} fontSize={{ base: "lg", md: "x-large" }} style={interRegular.style}>
                      Startups, large brands, fortune 500 media companies. Each of these companies have big needs and even bigger budgets to match them.
                    </Text>
                  </VStack>
                  <Box width={{ base: "100%", md: "50%" }}>
                    <Image src="/graph.png" alt="graph" layout="responsive" width={500} height={500} />
                  </Box>
                </Stack>

                <Stack
                  direction={{ base: "column-reverse", md: "row" }}
                  spacing={{ base: 10, md: 20 }}
                  alignItems="center"
                >
                  <Box width={{ base: "100%", md: "50%" }}>
                    <Image src="/feature_two.png" alt="feature" layout="responsive" width={500} height={500} />
                  </Box>
                  <VStack align={"start"} width={{ base: "100%", md: "50%" }}>
                    <Text
                      py={4}
                      as={"p"}
                      align={"start"}
                      fontSize={{ base: "xl", md: "xx-large" }}
                      style={interFat.style}
                    >
                      That are handpicked for your business
                    </Text>
                    <Text as={"p"} align={"start"} fontSize={{ base: "lg", md: "x-large" }} style={interRegular.style}>
                      No Tim Cook or Jeff Bezos contact details but you will find contact information for potential partners that make closing new business easy.
                    </Text>
                  </VStack>
                </Stack>

                <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 10, md: 20 }} alignItems="center">
                  <VStack align={"start"} width={{ base: "100%", md: "50%" }}>
                    <Text
                      py={4}
                      as={"p"}
                      align={"start"}
                      fontSize={{ base: "xl", md: "xx-large" }}
                      style={interFat.style}
                    >
                      And have verified contact information
                    </Text>
                    <Text as={"p"} align={"start"} fontSize={{ base: "lg", md: "x-large" }} style={interRegular.style}>
                      We manually collect and verify every single data point in our database. You can expect verified
                      email addresses and when publicly available.
                    </Text>
                  </VStack>
                  <Box width={{ base: "100%", md: "50%" }}>
                    <Image src="/feature_three.png" alt="diagram" layout="responsive" width={500} height={500} />
                  </Box>
                </Stack>
              </VStack>
            </chakra.section>

            <Box width="100%" height="auto" position="relative">
              <Image
                src="https://i.imgur.com/wz25XH2.png"
                alt="company-logos"
                layout="responsive"
                width={2000}
                height={2000}
              />
            </Box>

            <chakra.section id="features" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                Save A LOT of time and money
              </Text>
              <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interRegular.style}>
                We literally spend thousands of dollars and tens of hours gathering these lists
              </Text>

              <SimpleGrid py={6} columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                <Box>
                  <VStack align={"center"}>
                    <Text as={"p"} align={"center"} fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                      Carefully selected one by one
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "md", md: "large" }} style={interRegular.style}>
                      Each data point is collected and verified by a person. No bots or agents are involved.
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <VStack align={"center"}>
                    <Text as={"p"} align={"center"} fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                      Up to date and accurate
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "md", md: "large" }} style={interRegular.style}>
                      We spend thousands of dollars every year to access the world's best databases and tools.
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <VStack align={"center"}>
                    <Text as={"p"} align={"center"} fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                      Up to date and accurate
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "md", md: "large" }} style={interRegular.style}>
                      We are constantly updating our data and ensuring that they are valid and correct.
                    </Text>
                  </VStack>
                </Box>

                
              </SimpleGrid>
            </chakra.section>

            <chakra.section id="more-testimonials" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              
              <VStack spacing={8} align="center">
                {testimonialsData &&
                  testimonialsData.map((testimonial: any, index: any) => {
                    if (index > 5 && index < 8)
                      return (
                        <Box key={index} p={6} width="100%">
                          <VStack maxW={{ base: "100%", md: 700 }}>
                            <Avatar
                              height={90}
                              width={90}
                              name={testimonial.attributes.name}
                              src={
                                testimonial.attributes.profile_picture?.data?.[0]?.attributes?.url
                                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${testimonial.attributes.profile_picture.data[0].attributes.url}`
                                  : ""
                              }
                            />
                            <Text align={"center"} style={interExtraFat.style}>
                              {testimonial.attributes.name}
                            </Text>
                            <Text align={"center"} style={interFat.style}>
                              {testimonial.attributes.testimonial}
                            </Text>
                            <Text align={"center"} style={interRegular.style}>
                              {testimonial.attributes.title}
                            </Text>
                            <HStack>
                              {Array.from({ length: 5 }, (_, i) => (
                                <StarIcon key={i} color="yellow.500" />
                              ))}
                            </HStack>
                          </VStack>
                        </Box>
                      );
                  })}
              </VStack>
            </chakra.section>

            <chakra.section id="pricing" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                Make your money back today
              </Text>
              <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interRegular.style}>
                It takes just 1 deal to make your money back
              </Text>

              {products && (
                <Flex p={8} flexWrap="wrap" justifyContent="center" gap={6}>
                  {products
                    .sort((a: any, b: any) => a.attributes.rank - b.attributes.rank)
                    .map((product: any) => (
                      <CardComponent key={product.id} product={product} />
                    ))}
                </Flex>
              )}
              <Box width="100%" height="auto" position="relative">
                <Image
                  src="/companyLogo2.png"
                  alt="company-logos-2"
                  layout="responsive"
                  width={2000}
                  height={2000}
                />
              </Box>
            </chakra.section>

            <chakra.section id="faq" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text py={5} as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                Frequently Asked Questions
              </Text>
              <Accordion allowMultiple>
                {faqsData &&
                  faqsData
                    .sort((a, b) => a.attributes.rank - b.attributes.rank)
                    .map((faq) => (
                      <AccordionItem key={faq.id}>
                        <Text as={"h2"}>
                          <AccordionButton style={interFat.style}>
                            <Box flex="1" textAlign="left">
                              {faq.attributes.question}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </Text>
                        <AccordionPanel pb={4}>
                          <Box dangerouslySetInnerHTML={{ __html: faq.attributes.answer }} />
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
              </Accordion>
            </chakra.section>
          </VStack>
        </Center>
      </chakra.section>
    </Wrapper>
  );
};

export default TemplateApp;
