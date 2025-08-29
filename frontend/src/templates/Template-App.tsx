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
              The Ultimate TikTok Influencer Database
            </Text>

            <Text textAlign="center">A database to find influencers in seconds.</Text>

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
                    <Text style={interFat.style}>Database</Text>
                  </Button>
                  <Popover placement="bottom" trigger="hover">
                    <PopoverTrigger>
                      <Button
                        colorScheme="gray"
                        variant="solid"
                        borderRadius="10px"
                        size={{ base: "md", md: "lg" }}
                        px={8}
                      >
                        <Text style={interFat.style}>Get Instant Access</Text>
                      </Button>
                    </PopoverTrigger>
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
                TARGETED INFLUENCERS READY TO GENERATE REVENUE FOR YOUR BUSINESS
              </Text>

              <Box width="100%" height="auto" position="relative">
                <Image
                  src="https://i.imgur.com/wz25XH2.png"
                  alt="hero"
                  layout="responsive"
                  width={2000}
                  height={2000}
                />
              </Box>
            </chakra.section>

            <chakra.section id="how-it-works" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text py={5} as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                How It Works
              </Text>

              <Stack direction={{ base: "column", md: "row" }} spacing={10} align={"start"}>
                <VStack w={{ base: "100%", md: "33%" }} p={4} align={"start"}>
                  <Text fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                    1. Sign Up In Ten Seconds
                  </Text>
                  <Text fontSize={{ base: "md", md: "large" }}>
                    All you have to do is click the subscribe button and enter your email. That's it.
                  </Text>
                </VStack>

                <VStack w={{ base: "100%", md: "33%" }} p={4} align={"start"}>
                  <Text fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                    2. Receive Leads Instantly
                  </Text>
                  <Text fontSize={{ base: "md", md: "large" }}>
                    Receive instant access to the database of target influencers upon sign up + monthly updates.
                  </Text>
                </VStack>

                <VStack w={{ base: "100%", md: "33%" }} p={4} align={"start"}>
                  <Text fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                    3. Start Reaching Out Today
                  </Text>
                  <Text fontSize={{ base: "md", md: "large" }}>
                    Now that you have your influencers, you can start reaching out and closing deals.
                  </Text>
                </VStack>
              </Stack>
            </chakra.section>

            <chakra.section id="testimonials" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text py={5} as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                OUR CUSTOMERS HAVE MADE MILLIONS OF DOLLARS USING OUR LEADS
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
                src="https://i.imgur.com/wz25XH2.png"
                alt="company-logos"
                layout="responsive"
                width={2000}
                height={2000}
              />
            </Box>

            <chakra.section id="strategies" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                Streamline your outreach strategy
              </Text>
              <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interRegular.style}>
                A simple and effective way to do outreach for your business
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
                      Find Influencers
                    </Text>
                    <Text as={"p"} align={"start"} fontSize={{ base: "lg", md: "x-large" }} style={interRegular.style}>
                      From micro, to large influencers, to fortune 500 media companies. These influencers have big
                      audiences to grow your business.
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
                      No, you won't find Tesla or Elon's email as entries. You'll find contact information that makes it
                      easy to connect and build relationships with potential influencers.
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
                Save a ton of money and time
              </Text>
              <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interRegular.style}>
                We spend thousands of dollars and hundreds of hours collecting these contacts
              </Text>

              <SimpleGrid py={6} columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                <Box>
                  <VStack align={"center"}>
                    <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      🖐🏼
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                      Handpicked one by one
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "md", md: "large" }} style={interRegular.style}>
                      Every single data point is collected and verified by a human. Not a robot.
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <VStack align={"center"}>
                    <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      🧬
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                      100s of hours on research
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "md", md: "large" }} style={interRegular.style}>
                      We spend hundreds of hours every month to collect the most relevant companies.
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <VStack align={"center"}>
                    <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      💰
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                      1000s of dollars on tech
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "md", md: "large" }} style={interRegular.style}>
                      We spend thousands of dollars every year to access the world's best databases and tools.
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <VStack align={"center"}>
                    <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      📖
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                      Publicly available & verified
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "md", md: "large" }} style={interRegular.style}>
                      We check that our data points are publicly available and verify them one by one.
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <VStack align={"center"}>
                    <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      🇪🇺
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "lg", md: "x-large" }} style={interFat.style}>
                      GDPR Compliant
                    </Text>
                    <Text as={"p"} align={"center"} fontSize={{ base: "md", md: "large" }} style={interRegular.style}>
                      We are up to date with all the key privacy and data protection requirements of GDPR.
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <VStack align={"center"}>
                    <Text as={"p"} align={"center"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      ⭐️
                    </Text>
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

            <chakra.section id="reasons" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <VStack spacing={20}>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 10, md: 20 }}
                  width={"100%"}
                  align={"start"}
                >
                  <Box width={{ base: "100%", md: "50%" }}>
                    <Image
                      style={{ filter: "grayscale(100%)" }}
                      src="/small_agency.jpeg"
                      alt="small-agency"
                      layout="responsive"
                      width={500}
                      height={400}
                    />
                  </Box>
                  <VStack align={"start"} width={{ base: "100%", md: "50%" }}>
                    <Text as={"p"} align={"start"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      Join a small number of companies
                    </Text>
                    <UnorderedList>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          We have high prices by design and raise them constantly.
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          That way we throttle access and filter out low quality customers.
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          The number of our customer is in the low 10s.
                        </Text>
                      </ListItem>
                    </UnorderedList>
                  </VStack>
                </Stack>

                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 10, md: 20 }}
                  width={"100%"}
                  align={"start"}
                >
                  <Box width={{ base: "100%", md: "50%" }}>
                    <Image
                      style={{ filter: "grayscale(100%)" }}
                      src="/section_img2.jpg"
                      alt="customers"
                      layout="responsive"
                      width={500}
                      height={400}
                    />
                  </Box>
                  <VStack align={"start"} width={{ base: "100%", md: "50%" }}>
                    <Text as={"p"} align={"start"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      That are all doing different things
                    </Text>
                    <UnorderedList>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          No, you are not competing with each other.
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          Most of our customers target different influencers and niches.
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          Most of our customers are looking to promote very unique products or services.
                        </Text>
                      </ListItem>
                    </UnorderedList>
                  </VStack>
                </Stack>

                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 10, md: 20 }}
                  width={"100%"}
                  align={"start"}
                >
                  <Box width={{ base: "100%", md: "50%" }}>
                    <Image
                      style={{ filter: "grayscale(100%)" }}
                      src="/sec3_img.jpg"
                      alt="partnership"
                      layout="responsive"
                      width={500}
                      height={400}
                    />
                  </Box>
                  <VStack align={"start"} width={{ base: "100%", md: "50%" }}>
                    <Text as={"p"} align={"start"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      That are willing to form partnerships
                    </Text>
                    <UnorderedList>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          Performance marketing opportunities.
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          Referrals.
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          Direct influencers with an audience.
                        </Text>
                      </ListItem>
                    </UnorderedList>
                  </VStack>
                </Stack>

                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 10, md: 20 }}
                  width={"100%"}
                  align={"start"}
                >
                  <Box width={{ base: "100%", md: "50%" }}>
                    <Image
                      style={{ filter: "grayscale(100%)" }}
                      src="/sec4_img.jpg"
                      alt="experience"
                      layout="responsive"
                      width={500}
                      height={400}
                    />
                  </Box>
                  <VStack align={"start"} width={{ base: "100%", md: "50%" }}>
                    <Text as={"p"} align={"start"} fontSize={{ base: "xl", md: "xx-large" }} style={interFat.style}>
                      And have personal experience
                    </Text>
                    <UnorderedList>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          Personal relationship and welcoming present.
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          Direct access to the founder.
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          Free personal consultation
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text
                          as={"p"}
                          align={"start"}
                          fontSize={{ base: "md", md: "large" }}
                          style={interRegular.style}
                        >
                          Intros with other founders
                        </Text>
                      </ListItem>
                    </UnorderedList>
                  </VStack>
                </Stack>
              </VStack>
            </chakra.section>

            <chakra.section id="more-testimonials" position="relative" zIndex={20} justifyContent="center" py={"2rem"}>
              <Text py={5} as={"p"} align={"center"} fontSize={{ base: "2xl", md: "xxx-large" }} style={interFat.style}>
                OUR CUSTOMERS HAVE MADE MILLIONS OF DOLLARS USING OUR DATABASE
              </Text>
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
                Even a tiny deal with a high ticket client will make your money back for years
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
                  src="https://i.imgur.com/wz25XH2.png"
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
