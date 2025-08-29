import { getAllFaqs, fetchTestimonials, getAllProducts, fetchBlogPosts, getConfig } from '@/helpers';
import { FaqType, Product, ProductResponse, TestimonialType } from '@/types/types';
import { ErrorResponse } from '@/types/types';
import { GetStaticProps } from 'next';

export interface StaticPageProps {
  posts?: any[];
  featuredProduct?: Product | null;
  products?: Product[];
  faqs?: FaqType[];
  testimonials?: TestimonialType[];
  // Add other common static props as needed
}

type GetStaticPropsEnhancer = (
  originalGetStaticProps?: GetStaticProps | null,
  include?: string[]
) => GetStaticProps;

export const withCommonStaticProps: GetStaticPropsEnhancer = (
  originalGetStaticProps,
  include = []
) => {
  return async (context) => {
    // Fetch common static data
    const commonData = await fetchCommonStaticData(include);

    if (originalGetStaticProps) {
      // If page has its own getStaticProps, merge with common data
      const originalProps = await originalGetStaticProps(context);

      if ('props' in originalProps) {
        return {
          props: {
            ...commonData,
            ...originalProps.props,
          },
          revalidate: 60
        };
      }
      return originalProps;
    }

    // If no original getStaticProps, return common data
    return {
      props: commonData,
      revalidate: 60
    };
  };
};

// Helper function to fetch common static data
async function fetchCommonStaticData(include: string[]): Promise<StaticPageProps> {
  try {
    // Add your common static data fetching logic here
    // Example:
    const [products, posts, faqs, testimonials, configData] = await Promise.all([
      getAllProducts(),
      fetchBlogPosts(),
      getAllFaqs(),
      fetchTestimonials(),
      getConfig(),
    ]);
    let featuredProduct: Product | null = null;
    let allProducts: Product[] = [];

    if ("error" in products) {
      featuredProduct = null;
    } else {
      featuredProduct = products.data.find((product: Product) => product.attributes.featured) || products.data[0];
      allProducts = products.data;
    }
    const data = {
      posts,
      featuredProduct,
      products: allProducts,
      faqs,
      testimonials,
      config: configData.data,
    }
    let selectedData: any = {};
    if (include.length === 0) {
      return data;
    }
    for (const item of include) {
      selectedData[item] = data[item as keyof typeof data] || null;
    }
    return selectedData;

  } catch (error) {
    console.error('Error fetching common static data:', error);
    return {};
  }
}

