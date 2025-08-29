import { BlocksContent } from "@strapi/blocks-react-renderer";

// Define the props that the PaginationComponent will accept
export type PaginationProps = {
    currentPage: number;     // The current page number
    pageCount: number;       // Total number of pages
    decrementPage: () => void; // Function to go to the previous page
    incrementPage: () => void; // Function to go to the next page
    setPageSize: (pageSize: number) => void; // Function to set the number of items per page
};
export type Meta = {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}

export type TestimonialType = {
    id: number;
    attributes: {
        name: string;
        title: string;
        testimonial: string;
        profile_picture: {
            data: [{
                attributes: {
                    url: string;
                    width: number;
                    height: number;
                    name: string;
                    alternativeText: string;
                }
            }]
        }
    }
}

export type TestimonialResponse = {
    data: TestimonialType[];
    meta: Meta;
}
export type FaqType = {
    id: number;
    attributes: {
        question: string;
        answer: string;
        rank: number
    }
}
export type FaqResponse = {
    data: FaqType[];
    meta: Meta;
}
//Types
export type BlogPostType = {
    id: number;
    attributes: {
        author: string;
        content: BlocksContent;
        publishedAt: string;
        createdAt: string;
        updatedAt: string;
        title: string;
        description: string;
        slug: string;

    }
}
export type Pagination = { page: number, pageSize: number, pageCount: number, total: number }

export type FilterOption = {
    key: string;
    type: string;
    options: {
        value: string;
    }[]
}

export type Result = {
    header: {
        headername: string;
        value: string;
    }[];
}

export interface ColumnMetadata {
    key: string;
    type: 'select' | 'search';
    options?: string[];
}

export interface DatabaseResult {
    db: {
        pagination: Pagination;
        results: Result[];
    };
    filters: ColumnMetadata[];
    totalEntriesInDatabase: number;
    message: string;
    error?: string;
}

export type DatabaseState = {
    page: number
    pageCount: number
    total: number
    pageSize: number
    incrementPage: () => void
    decrementPage: () => void
    setPage: (number: number) => void
    setTotal: (number: number) => void
    setPageCount: (number: number) => void
    setPageSize: (number: number) => void
}

export type RelationData = {
    name: string
    active: boolean
}

export type Product = {
    id: number;
    attributes: {
        title: string;
        description: string;
        stripe: string;
        price: number;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        oldprice: number;
        redirect: string | null;
        features: string[];
        cta_text: string | null;
        featured: boolean;
        rank: number;
        priceId: string | null;
        mode: string;
    }
}


export type configType = {
    attributes: {
        projectname: string,
        seo_title: string,
        seo_description: string,
        twitter_handle: string,
        template: 'main' | 'app',
        allowDemo: boolean,
        onlyDemo: boolean
    }
}

export type SortingState = {
    id: string;
    desc: boolean;
}[];

export interface ProductResponse {
    data: Product[];
    meta: Meta;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

export interface FetchResponse {
    success: boolean;
    message: string;
    error?: string;
}