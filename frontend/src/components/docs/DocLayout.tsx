import React from "react";
import { Box, Container, Grid, GridItem } from "@chakra-ui/react";
import DocSidebar from "./DocSidebar";

interface DocLayoutProps {
  children: React.ReactNode;
}

const DocLayout: React.FC<DocLayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" bg="neutral.50">
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} gap={8}>
          <GridItem display={{ base: "none", md: "block" }}>
            <DocSidebar />
          </GridItem>
          <GridItem bg="white" p={8} borderRadius="lg" shadow="sm">
            {children}
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default DocLayout;
