import { getConfig } from "@/helpers";
import TemplateApp from "@/templates/Template-App";
import TemplateMain from "@/templates/Template-Main";
import { configType, ErrorResponse, FaqType, Product, TestimonialType } from "@/types/types";
import { GetStaticProps, NextPage } from "next";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { withCommonStaticProps } from "@/utils/data-service";

type HomeProps = {
  featuredProduct: Product | null;
  configData: configType | ErrorResponse;
  faqs: FaqType[];
  testimonials: TestimonialType[];
  products: Product[];
};

const Home: NextPage<HomeProps> = ({ featuredProduct, configData, faqs, testimonials, products }: HomeProps) => {
  if ("error" in configData) {
    return <div>Error loading configuration. Please try again later.</div>;
  }

  if (!configData) {
    return <TemplateMain featuredProduct={featuredProduct} faqs={faqs} products={products} config={configData} />;
  }

  switch (configData.attributes.template) {
    case "main":
      return <TemplateMain featuredProduct={featuredProduct} faqs={faqs} products={products} config={configData} />;
    case "app":
    default:
      return (
        <TemplateApp
          featuredProduct={featuredProduct}
          faqs={faqs}
          testimonials={testimonials}
          products={products}
          config={configData}
        />
      );
  }
};

export default Home;

export const getStaticProps: GetStaticProps = withCommonStaticProps(async () => {
  const queryResponse = await getConfig();
  if ("error" in queryResponse) {
    return {
      props: { configData: queryResponse },
    };
  }

  return {
    props: { configData: queryResponse.data },
  };
});
