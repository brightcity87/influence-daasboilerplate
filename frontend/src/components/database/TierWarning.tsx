import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Text } from "@chakra-ui/react";

interface TierWarningProps {
  settings: any;
}

export const TierWarning = ({ settings }: TierWarningProps) => {
  if (!settings) return null;

  const warnings = [];

  // Only show warning if there's a limit (greater than 0) and we've reached it
  if (settings.searchLimit > 0 && settings.currentSearchCount >= settings.searchLimit) {
    warnings.push(`Search limit (${settings.currentSearchCount}/${settings.searchLimit}) reached`);
  }

  if (settings.exportLimit > 0 && settings.currentExportCount >= settings.exportLimit) {
    warnings.push(`Export limit (${settings.currentExportCount}/${settings.exportLimit}) reached`);
  }

  if (warnings.length === 0) return null;

  return (
    <Alert status="warning" mb={0}>
      <AlertIcon />
      <Box>
        <AlertTitle fontSize="sm">Usage Limits</AlertTitle>
        <AlertDescription fontSize="sm">
          {warnings.map((warning, i) => (
            <Text key={i}>{warning}</Text>
          ))}
        </AlertDescription>
      </Box>
    </Alert>
  );
};
