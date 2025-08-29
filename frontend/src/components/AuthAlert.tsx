import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from "@chakra-ui/react";
import Wrapper from "./Wrapper";
import CTA from "./CTA";
import { Product } from "@/types/types";
import { configType } from "@/types/types";
type AuthAlertProps = {
  featuredProduct: Product | null;
  config: configType;
};
export const AuthAlert = ({ featuredProduct, config }: AuthAlertProps) => {
  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Alert
          status="warning"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          maxW="xl"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Authentication Required
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            You must log in to access the database. Please log in to gain access.
          </AlertDescription>
        </Alert>
      </Box>
    </Wrapper>
  );
};
