import {
  Box,
  Button,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useColorMode,
  useDisclosure,
  useTheme,
  useToast,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";

import { getAllProducts, sendLoginLink } from "@/helpers";
import { Product, configType } from "@/types/types";
import { HamburgerIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import Link from "next/link";
import { BsDatabase } from "react-icons/bs";
import useSWR from "swr";
import { AuthContext } from "../pages/_app";
import { interFat, interRegular } from "../styles/theming";
import CTA from "./CTA";
import { useRouter } from "next/router";
const PROJECTNAME = process.env.NEXT_PUBLIC_PROJECTNAME;

type NavBarHeaderProps = {
  featuredProduct: Product | null;
  config: configType;
};

export const NavBarHeader = ({ featuredProduct, config }: NavBarHeaderProps) => {
  // Hooks for managing color mode, theme, and UI interactions
  const router = useRouter();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const toast = useToast();
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const { isLoggedIn, loading } = useContext(AuthContext);

  // Get theme colors based on current color mode
  const bgColor = theme.colors.navbar.bg[colorMode];
  const textPrimary = theme.colors.navbar.textPrimary[colorMode];

  useEffect(() => {
    if (config?.attributes.onlyDemo) {
      toast.closeAll();
      toast({
        title: "Demo Mode",
        description:
          "You're using a free demo of DaasBoilerplate. You're automatically logged in to access the mock database.",
        status: "info",
        duration: 10000,
        isClosable: true,
      });
    }
  }, [toast, config]);
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await sendLoginLink(email);
    toast.closeAll();
    if (response.success) {
      onLoginClose();
      toast({
        title: "Login Link Sent",
        description: response.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setEmail("");
    } else {
      toast({
        title: "Error Sending Login Link",
        description: response.error || "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  // Handle user logout
  const handleLogout = () => {
    Cookies.remove("authToken");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    // Reload the website after a short delay to ensure the toast is visible
    React.startTransition(() => {
      window.location.reload();
    });
  };
  const NavLinks = () => (
    <>
      <Text
        as="a"
        href={process.env.NEXT_PUBLIC_FRONTEND_URL + "#pricing"}
        color={textPrimary}
        style={interRegular.style}
      >
        Price
      </Text>
      <Text
        as="a"
        href={process.env.NEXT_PUBLIC_FRONTEND_URL + "#testimonials"}
        color={textPrimary}
        style={interRegular.style}
      >
        Testimonials
      </Text>
      <Text as={Link} href="/docs" color={textPrimary} style={interRegular.style}>
        Docs
      </Text>
      <Text as="a" href={process.env.NEXT_PUBLIC_FRONTEND_URL + "#faq"} color={textPrimary} style={interRegular.style}>
        FAQ
      </Text>
      <Text as={Link} href="/blog" color={textPrimary} style={interRegular.style}>
        Blog
      </Text>
      <Text as={Link} href="/contact-us" color={textPrimary} style={interRegular.style}>
        Contact us
      </Text>
    </>
  );
  const AuthButtons = () => {
    if (loading) {
      return <Skeleton height="40px" width="200px" />;
    }

    if (isLoggedIn) {
      return (
        <>
          <Button onClick={handleLogout} colorScheme="gray" variant="ghost" mr={2}>
            Logout
          </Button>
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
            size="lg"
          >
            <Icon fontSize="16px" as={BsDatabase} mr={2} />
            Database!
          </Button>
        </>
      );
    }

    if (!isLoggedIn && config?.attributes?.onlyDemo !== true) {
      let accessButton;
      if (featuredProduct) {
        accessButton = (
          <CTA
            innerText="Get Instant Access"
            redirect={featuredProduct.attributes.redirect}
            priceId={featuredProduct.attributes.priceId}
            mode={featuredProduct.attributes.mode}
          />
        );
      } else {
        accessButton = (
          <Button colorScheme="brand" variant="solid" borderRadius="10px" size="lg" px={8} isDisabled>
            <Text style={interFat.style}>Please configure a featured product</Text>
          </Button>
        );
      }

      return (
        <>
          <Button onClick={onLoginOpen} colorScheme="brand" variant="outline" mr={2}>
            Login
          </Button>
          {accessButton}
        </>
      );
    }

    return (
      <>
        <Button as={Link} href="/database?demo=true" colorScheme="brand" variant="outline" mr={2}>
          Database
        </Button>
        <Popover placement="bottom" trigger="hover">
          <PopoverTrigger>
            <Button colorScheme="gray" variant="solid" borderRadius="10px" size="lg" px={8}>
              <Text style={interFat.style}>Get Instant Access</Text>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>This is a demo project. You already have access. Just click the Database button!</PopoverBody>
          </PopoverContent>
        </Popover>
      </>
    );
  };
  const showDemoBanner =
    (config?.attributes?.allowDemo === true || config?.attributes?.onlyDemo === true) &&
    (router.pathname === "/database" || router.query.demo === "true") &&
    !isLoggedIn;

  return (
    <>
      {/* Main navigation header */}
      <chakra.header
        w="full"
        bgColor={bgColor}
        position="sticky"
        top="0"
        zIndex={100}
        pb={"1rem"}
        pt={showDemoBanner ? "0rem" : "1rem"}
      >
        {showDemoBanner && (
          <Box w="full" bg="neutral.50" p={2} textAlign="center" mb={"1rem"}>
            <Text fontSize="sm">👋 You are viewing a demo version of the database</Text>
          </Box>
        )}
        <Flex
          as={"nav"}
          maxW={["100%", "100%", "768px", "992px", "1200px", "1536px"]} // Responsive maximum width
          justifyContent="space-between"
          alignItems="center"
          mx="auto"
          px={4}
        >
          {/* Logo and project name */}
          <HStack spacing={4}>
            <Text fontSize="xx-large">🚀</Text>
            <Link href="/">
              <Text fontSize="xl" color={textPrimary} style={interFat.style}>
                {PROJECTNAME}
              </Text>
            </Link>
          </HStack>

          {/* Desktop Navigation */}
          <HStack spacing={{ lg: 4, xl: 10 }} display={{ base: "none", lg: "flex" }}>
            <NavLinks />
          </HStack>

          {/* Desktop Auth Buttons shown only on large screens to avoid overflow on tablets/small screens */}
          <HStack display={{ base: "none", lg: "flex" }}>
            <AuthButtons />
          </HStack>

          {/* Mobile Menu Button visible on small/tablet screens */}
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            onClick={onMenuOpen}
            display={{ base: "flex", lg: "none" }}
          />
        </Flex>
      </chakra.header>

      {/* Mobile Menu Drawer */}
      <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <NavLinks />
              <AuthButtons />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={onLoginClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleLogin}>
            <ModalBody>
              <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="brand" type="submit">
                Send Login Link
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
