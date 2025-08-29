import React, { ReactElement, useState } from "react";
import { Button, ButtonProps, useToast, useBreakpointValue } from "@chakra-ui/react";
import { handleGetAccess } from "../helpers";
import Link from "next/link";

// Define the props that the CTA component accepts
interface CTAProps extends ButtonProps {
  innerText: string; // The text to display on the button
  redirect?: string | null; // Optional URL to redirect to when clicked
  priceId: string | null; // Optional Stripe price ID for the product
  successUrl?: string; // Optional URL to redirect to when the purchase is successful
  cancelUrl?: string; // Optional URL to redirect to when the purchase is canceled
  mode?: string; // Optional subscription type
  leftIcon?: ReactElement<any, string> | undefined; // Optional left icon for the button
}

// CTA (Call To Action) component definition
const CTA: React.FC<CTAProps> = ({
  innerText,
  redirect,
  priceId,
  successUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success`,
  cancelUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/`,
  leftIcon,
  mode,
  ...props
}) => {
  // Hook to display toast notifications
  const toast = useToast();

  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);

  // Use useBreakpointValue to set responsive button size and border radius
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const buttonBorderRadius = useBreakpointValue({ base: "8px", md: "10px" });

  // Function to handle button click
  const handleClick = async () => {
    // Check if a price ID is provided
    if (!priceId) {
      // If no price ID, show an error toast
      toast({
        title: "No price ID provided",
        status: "error",
      });
      return;
    }

    // Get the Rewardful referral ID
    const referralId = (window as any).Rewardful?.referral;

    try {
      // Call handleGetAccess with the referral ID
      await handleGetAccess(priceId, successUrl, cancelUrl, referralId, mode);
    } catch (error) {
      console.error("Error in handleGetAccess:", error);
      toast({
        title: "Error processing your request",
        description: "Please try again later.",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Define the button component with responsive styling
  const ButtonComponent = (
    <Button
      colorScheme="brand"
      borderRadius={buttonBorderRadius}
      size={buttonSize}
      onClick={handleClick}
      isLoading={isLoading}
      loadingText="Processing..."
      leftIcon={leftIcon}
      {...props} // Spread remaining props from parent
    >
      {innerText}
    </Button>
  );

  // If a redirect URL is provided, wrap the button in a Link component
  // Otherwise, just return the button
  return redirect ? <Link href={redirect}>{ButtonComponent}</Link> : ButtonComponent;
};

export default CTA;
