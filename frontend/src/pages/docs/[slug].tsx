import { GetStaticProps, GetStaticPaths, Metadata, ResolvingMetadata } from "next";
import { Box, Heading } from "@chakra-ui/react";
import Wrapper from "@/components/Wrapper";
import DocLayout from "@/components/docs/DocLayout";
import DocContent from "@/components/docs/DocContent";
import { getDocNode } from "@/utils/data-service-server";
import { getDocBySlug, getAllDocPaths, DocSection } from "@/utils/docs-service";
import { withCommonStaticProps } from "@/utils/data-service";
import { Product } from "@/types/types";

interface DocPageProps {
  doc: DocSection & { content: string };
  config: any;
  featuredProduct: Product;
}

export async function generateMetadata({ doc }: DocPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  return {
    title: doc.title,
    description: "Comprehensive documentation for the DaaS Boilerplate",
  };
}

const DocPage = ({ doc, config, featuredProduct }: DocPageProps) => {
  if (!doc) return null;

  return (
    <Wrapper config={config} featuredProduct={featuredProduct}>
      <DocLayout>
        <Box>
          <Heading as="h1" size="2xl" mb={8}>
            {doc.title}
          </Heading>
          {doc.content && <DocContent content={doc.content} />}
        </Box>
      </DocLayout>
    </Wrapper>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllDocPaths().map((path) => ({
    params: { slug: path },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params;
  const propsConstructor = await withCommonStaticProps();
  const commonProps = await propsConstructor(context);
  const slug = params?.slug as string;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {
      notFound: true,
    };
  }
  // Fetch content from API
  const data = await getDocNode({ slug: doc.path });
  let content = null;
  if ("error" in data) {
    content = null;
  } else {
    content = data.content;
  }

  return {
    props: {
      ...(commonProps as any).props,
      doc: {
        ...doc,
        content,
      },
    },
  };
};

export default DocPage;
