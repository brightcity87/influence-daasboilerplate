import { Alert, AlertIcon, Box, Text } from "@chakra-ui/react";

type ProTipProps = {
  content: string;
};

export const ProTip = ({ content }: ProTipProps) => (
  <Alert status="success" variant="left-accent" mb={8}>
    <AlertIcon />
    <Box>
      <Text fontWeight="bold" mb={1}>
        Pro Tip
      </Text>
      <Text>{content}</Text>
    </Box>
  </Alert>
);
