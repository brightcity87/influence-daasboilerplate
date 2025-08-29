import React from "react";
import { Box } from "@chakra-ui/react";

interface DocContentProps {
  content: string;
}

const DocContent: React.FC<DocContentProps> = ({ content }) => {
  return (
    <Box
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: content }}
      sx={{
        h1: {
          fontSize: "3xl",
          fontWeight: "bold",
          mb: 6,
          mt: 8,
        },
        h2: {
          fontSize: "2xl",
          fontWeight: "bold",
          mb: 4,
          mt: 6,
        },
        h3: {
          fontSize: "xl",
          fontWeight: "bold",
          mb: 3,
          mt: 5,
        },
        p: {
          mb: 4,
          lineHeight: 1.7,
        },
        "ul, ol": {
          ml: 6,
          mb: 4,
        },
        li: {
          mb: 2,
        },
        pre: {
          bg: "gray.50",
          p: 4,
          borderRadius: "md",
          overflow: "auto",
          mb: 4,
        },
        code: {
          fontFamily: "mono",
          bg: "gray.50",
          p: 1,
          borderRadius: "sm",
        },
        blockquote: {
          borderLeft: "4px",
          borderColor: "blue.500",
          pl: 4,
          ml: 0,
          mb: 4,
          display: "none",
          opacity: 0,
        },
        a: {
          color: "blue.500",
          textDecoration: "none",
          _hover: {
            textDecoration: "underline",
          },
        },
        table: {
          width: "full",
          mb: 4,
          borderCollapse: "collapse",
        },
        "th, td": {
          border: "1px",
          borderColor: "gray.200",
          p: 2,
        },
        th: {
          bg: "gray.50",
          fontWeight: "bold",
        },
        ".note": {
          bg: "blue.50",
          p: 4,
          borderRadius: "md",
          mb: 4,
        },
      }}
    />
  );
};

export default DocContent;
