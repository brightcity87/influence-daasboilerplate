import { Box, Text } from "@chakra-ui/react";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type CodeBlockProps = {
  code: string;
  language?: string;
  description?: string;
};

export const CodeBlock = ({ code, language = "bash", description }: CodeBlockProps) => (
  <Box mb={8}>
    {description && (
      <Text mb={2} color="gray.600">
        {description}
      </Text>
    )}
    <pre>
      <code>{code}</code>
    </pre>
    {/* <SyntaxHighlighter
      language={language}
      style={atomDark}
      customStyle={{
        borderRadius: "0.5rem",
        padding: "1rem",
        margin: 0,
      }}
    >
      {code}
    </SyntaxHighlighter> */}
  </Box>
);
