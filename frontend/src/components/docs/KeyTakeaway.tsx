import { Alert, AlertIcon, Box, Text } from "@chakra-ui/react";

type KeyTakeawayProps = {
  content: string;
};

export const KeyTakeaway = ({ content }: KeyTakeawayProps) => (
  <Alert status="info" variant="left-accent" mb={8}>
    <AlertIcon />
    <Box>
      <Text fontWeight="bold" mb={1}>
        Key Takeaway
      </Text>
      <Text>{content}</Text>
    </Box>
  </Alert>
);
