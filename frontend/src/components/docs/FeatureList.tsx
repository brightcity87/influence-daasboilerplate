import { SimpleGrid, VStack, Icon, Text } from "@chakra-ui/react";
import { getIconComponent } from "@/utils/icons";

type Feature = {
  title: string;
  description: string;
  icon: string;
};

type FeatureListProps = {
  features: Feature[];
};

export const FeatureList = ({ features }: FeatureListProps) => (
  <SimpleGrid columns={{ base: 1, md: features.length > 2 ? 3 : 2 }} spacing={6} mb={8}>
    {features.map((feature, index) => (
      <VStack
        key={index}
        align="start"
        p={6}
        bg="white"
        rounded="lg"
        shadow="md"
        borderWidth="1px"
        borderColor="gray.100"
        _hover={{ shadow: "lg", borderColor: "blue.100" }}
        transition="all 0.2s"
      >
        <Icon as={getIconComponent(feature.icon)} w={6} h={6} color="blue.500" />
        <Text fontWeight="bold">{feature.title}</Text>
        <Text color="gray.600" fontSize="sm">
          {feature.description}
        </Text>
      </VStack>
    ))}
  </SimpleGrid>
);
