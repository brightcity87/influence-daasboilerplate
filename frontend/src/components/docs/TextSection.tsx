import { Box, Heading } from "@chakra-ui/react";

type TextSectionProps = {
  heading?: string;
  content: string;
};

export const TextSection = ({ heading, content }: TextSectionProps) => (
  <Box mb={8}>
    {heading && (
      <Heading as="h3" size="lg" mb={4} fontFamily="serif" letterSpacing="tight" color="gray.700">
        {heading}
      </Heading>
    )}
    <Box dangerouslySetInnerHTML={{ __html: content }} />
  </Box>
);
