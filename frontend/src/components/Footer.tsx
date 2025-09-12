import { interFat, interRegular } from "@/styles/theming";
import {
  Box,
  Center,
  HStack,
  List,
  ListItem,
  Text,
  VStack,
  chakra,
  useColorMode,
  useTheme,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import Link from "next/link";

export const Footer = () => {
  // Use Chakra UI's theme and color mode hooks
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const PROJECTNAME = process.env.NEXT_PUBLIC_PROJECTNAME;

  // Get the appropriate text color based on the current color mode (light/dark)
  const textPrimary = theme.colors.navbar.textPrimary[colorMode];
  const lighterSection = theme.colors.sections.lighter;

  return (
    <chakra.footer
      id="footer"
      position="relative"
      zIndex={20}
      justifyContent="center"
      py={"4rem"}
      bgColor={lighterSection}
    >
      <Center>
        {/* Responsive container for footer content */}
        <Box maxW={["90%", "90%", "768px", "992px", "1200px", "1300px"]} w="full">
          {/* Main footer content layout */}
          <SimpleGrid columns={[1, 1, 3]} spacing={[10, 10, 20]} w="full">
            {/* Left column: Project name and copyright */}
            <VStack align={["center", "center", "start"]} spacing={5}>
              <Flex alignItems="center" justifyContent={["center", "center", "flex-start"]}>
                <Text fontSize="large" mr={2}>
                  🚀
                </Text>
                {/* Link to home page with project name */}
                <Link href="/">
                  <Text fontSize="xl" color={textPrimary} style={interFat.style}>
                    {PROJECTNAME}
                  </Text>
                </Link>
              </Flex>

              {/* Copyright notice */}
              <Text textAlign={"center"} color={"grey"}>
                &copy; {new Date().getFullYear()} {PROJECTNAME}. All rights reserved.
              </Text>
              {/* Disclaimer */}
              <Text fontSize="xs" color="gray.500" textAlign={["center", "center", "left"]}>
                Unless expressly stated, LeadsInc is not endorsed by, affiliated with, authorized by, or in any way officially connected to any event organizer or any of its subsidiaries or affiliates. All product and company names are the registered trademarks of their original owners.
              </Text>
            </VStack>

            {/* Middle column: Links */}
            <VStack align={["center", "center", "start"]} spacing={2}>
              <chakra.h2 fontSize="medium" color="grey" style={interFat.style} fontWeight="bold">
                LINKS
              </chakra.h2>
              <List
                style={interRegular.style}
                fontSize="medium"
                fontWeight="normal"
                my={2}
                textAlign={["center", "center", "left"]}
              >
                <VStack align={["center", "center", "start"]} spacing={2}>
                  {/* Navigation links */}
                  <ListItem as={Link} href="/#pricing">
                    Pricing
                  </ListItem>
                  <ListItem as={Link} href="/blog">
                    Blog
                  </ListItem>
                </VStack>
              </List>
            </VStack>

            {/* Right column: Legal links */}
            <VStack align={["center", "center", "start"]} spacing={2}>
              <chakra.h2 fontSize="medium" color="grey" style={interFat.style} fontWeight="bold">
                LEGAL
              </chakra.h2>
              <List
                style={interRegular.style}
                fontSize="medium"
                fontWeight="normal"
                my={2}
                textAlign={["center", "center", "left"]}
              >
                <VStack align={["center", "center", "start"]} spacing={2}>
                  {/* Legal document links */}
                  <ListItem as={Link} href="/terms-of-service">
                    Terms of services
                  </ListItem>
                  <ListItem as={Link} href="/privacy-policy">
                    Privacy policy
                  </ListItem>
                </VStack>
              </List>
            </VStack>
          </SimpleGrid>
        </Box>
      </Center>
    </chakra.footer>
  );
};
