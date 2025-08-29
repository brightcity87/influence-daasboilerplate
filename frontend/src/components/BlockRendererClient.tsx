import {
  Text,
  VStack
} from '@chakra-ui/react';
import Image from "next/image";
import Link from "next/link";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

// This is the main component that renders content blocks
// This basically renders the WYSIWYG editor content from Strapi
export default function BlockRendererClient({
  content,
}: {
  readonly content: BlocksContent;
}) {
  if (!content) return null;
  return (
    <VStack align={'start'}>

    <BlocksRenderer
    content={content}
    blocks={{
        // Custom renderer for image blocks
        image: ({ image }) => {
            return(
            <Image 
            src={image.url} alt={"Blogpost header image of "+ image.alternativeText } 
            width={800}
            height={600}
            objectPosition="center"
            unoptimized={true}
            />       
        )},
      // Custom renderer for paragraph blocks
      paragraph: ({ children }) => <Text as='p'>{children}</Text>,
      // Custom renderer for list blocks
      list: ({ children }) => <Text as='ul'>{children}</Text>,
      // Custom renderer for heading blocks with different levels
      heading: ({ children, level }) => {
        switch (level) {
          case 1:
            return <Text as='h1' fontSize='xx-large'>{children}</Text>
          case 2:
            return <Text as='h2' fontSize='x-large'>{children}</Text>
          case 3:
            return <Text as='h3' fontSize='larger'>{children}</Text>
          case 4:
            return <Text as='h4' fontSize='large'>{children}</Text>
          case 5:
            return <Text as='h5'>{children}</Text>
          case 6:
            return <Text as='h6'>{children}</Text>
        }
      },
      // Custom renderer for link blocks
      link: ({ children, url }) => <Text as={Link} color='blue.600' href={url}>{children}</Text>,
    }}
    // Custom modifiers for inline text styling
    modifiers={{
      bold: ({ children }) => <strong>{children}</strong>,
      italic: ({ children }) => <span className="italic">{children}</span>,
    }}

  />    </VStack>


  );
}

// Explanation for newcomers:
// 1. This component (BlockRendererClient) is responsible for rendering content blocks.
// 2. It uses the BlocksRenderer component from @strapi/blocks-react-renderer to handle the rendering.
// 3. The 'blocks' prop defines custom renderers for different types of content (images, paragraphs, lists, headings, links).
// 4. The 'modifiers' prop defines how to render inline text styles (bold, italic).
// 5. Each custom renderer (like image, paragraph, heading) defines how that specific type of content should be displayed.
// 6. The component uses Chakra UI components (like Text, VStack) for consistent styling.
// 7. For images, it uses Next.js's Image component for optimized image loading.
// 8. The heading renderer adjusts the font size based on the heading level (h1 to h6).
// 9. This setup allows for flexible and customizable content rendering from a CMS like Strapi.