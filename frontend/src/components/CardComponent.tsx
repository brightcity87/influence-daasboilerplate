import CTA from "@/components/CTA";
import { interExtraFat, interFat } from "@/styles/theming";
import { Product } from "@/types/types";
import { CheckIcon, StarIcon } from "@chakra-ui/icons";
import { Box, Card, CardBody, CardFooter, CardHeader, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

// This component represents a card for displaying product information
// It takes a 'product' prop of type 'Product'
const CardComponent: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Card
      align="center"
      shadow={"lg"}
      position="relative"
      // Conditional styling for featured products
      borderWidth={product.attributes.featured ? "2px" : "1px"}
      borderColor={product.attributes.featured ? "brand.500" : "inherit"}
      minWidth="300px" // Added minimum width for each card
    >
      {/* Display a "Popular" badge for featured products */}
      {product.attributes.featured && (
        <Box
          position="absolute"
          top="-10px"
          left="50%"
          transform="translateX(-50%)"
          bg="brand.500"
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="sm"
          fontWeight="bold"
        >
          <HStack spacing={1}>
            <StarIcon w={4} h={4} />
            <Text>Popular</Text>
          </HStack>
        </Box>
      )}
      <CardHeader>
        <Heading size="md">{product.attributes.title}</Heading>
      </CardHeader>

      {/* Price display section */}
      <HStack>
        <Text color={"grey"} textDecoration="line-through">
          ${product.attributes.oldprice}
        </Text>
        {/* Using custom font styles for the main price */}
        <Text fontSize={"xxx-large"} style={interExtraFat.style}>
          ${product.attributes.price}
        </Text>
        <Text fontSize={"small"} color={"grey"} style={interFat.style}>
          USD
        </Text>
      </HStack>

      <CardBody>
        <VStack>
          {/* Mapping through product features and displaying them with checkmarks */}
          {product.attributes.features.map((feature, index) => (
            <HStack key={index} align="center">
              <CheckIcon />
              <Text>{feature}</Text>
            </HStack>
          ))}

          {/* CTA (Call to Action) component with dynamic text and attributes */}
          <CTA
            innerText={product.attributes.cta_text || "Get Instant Access!"}
            redirect={product.attributes.redirect}
            priceId={product.attributes.priceId || product.attributes.stripe}
            mode={product.attributes.mode}
          />
        </VStack>
      </CardBody>
      <CardFooter mt={-7}>{product.attributes.description}</CardFooter>
    </Card>
  );
};

export default CardComponent;
