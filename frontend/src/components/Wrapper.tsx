// Import necessary components from Chakra UI and local components
import { Box, chakra } from "@chakra-ui/react";
import { Footer } from "./Footer";
import { NavBarHeader } from "./NavBarHeader";
import { configType, Product } from "@/types/types";
import Head from "next/head";

// Define the props interface for the Wrapper component
// It accepts a single prop 'children' of type React.ReactNode
interface WrapperProps {
  children: React.ReactNode;
  featuredProduct: Product | null;
  config: configType;
}

// Define the Wrapper component as a functional component
// It uses the WrapperProps interface to type its props
const Wrapper: React.FC<WrapperProps> = ({ children, featuredProduct, config }) => {
  return (
    // The empty fragments <> </> are used to return multiple elements without adding extra nodes to the DOM
    <>
      {/* chakra.main is a Chakra UI component that renders as a <main> HTML element */}
      <chakra.main minH="100vh" display="flex" flexDirection="column">
        {/* NavBarHeader component is rendered at the top */}
        <NavBarHeader featuredProduct={featuredProduct} config={config} />
        {/* The 'children' prop is rendered here, allowing content to be placed between NavBarHeader and Footer */}
        <Box flex="1">{children}</Box>
        {/* Footer component is rendered at the bottom */}
        <Footer />
      </chakra.main>
    </>
  );
};

// Export the Wrapper component as the default export
export default Wrapper;
