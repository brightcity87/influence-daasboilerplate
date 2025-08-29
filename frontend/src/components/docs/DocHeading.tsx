import { Heading } from "@chakra-ui/react";

type DocHeadingProps = {
  children: React.ReactNode;
};

export const DocHeading = ({ children }: DocHeadingProps) => (
  <Heading
    as="h1"
    size="2xl"
    mb={8}
    pb={4}
    borderBottom="2px"
    borderColor="gray.200"
    fontFamily="serif"
    letterSpacing="tight"
  >
    {children}
  </Heading>
);
