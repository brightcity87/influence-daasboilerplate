import { useToast } from '@chakra-ui/react';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { useState, useEffect } from 'react';
import { StoreApi } from 'zustand';
import Cookies from 'js-cookie';
import { ErrorResponse, ProductResponse, FetchResponse } from './types/types';
import { fetchWithAuth } from './utils/api';
//Helper functions
const getApiHost = (): string => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_LBACKEND_URL || '';
    }
    return process.env.NEXT_PUBLIC_BACKEND_URL || '';
}
const API_URL_ENUM = getApiHost();
export const convertToStrapiImage = (imageLink?: string): string => {
    let result = ""
    if (imageLink) {
        result = (imageLink.includes("/uploads/") ?
            API_URL_ENUM + imageLink :
            imageLink)
    }

    return result
}


export const tryParseJSONObject = (jsonString: string): JSON | boolean => {
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};

//Fixes the persist hydration nextjs zustand issue
export const useStoreEffect = <T, F>(
    store: StoreApi<T>,
    callback: (state: T) => F
) => {
    const result = store.getState();
    const selectedState = callback(result);
    const [data, setData] = useState<F>(selectedState);

    useEffect(() => {
        const unsubscribe = store.subscribe((newState: T) => {
            setData(callback(newState));
        });

        return () => unsubscribe();
    }, []);

    return data;
};


// Add sortinzg to the FilterParams interface
interface FilterParams {
    page: number;
    pageSize: number;
    filteredOptions: { [key: string]: string };
    searchTerm: string;
    sorting?: { id: string; desc: boolean }[];
    type?: string;
}

export const fetchFilteredDatabase = async (variables: any, isDemoMode: boolean = false) => {
    const path = isDemoMode ? '/api/database/demo-filter' : '/api/database/filter';
    const fetchCall = isDemoMode ? fetch : fetchWithAuth;
    try {
        const response = await fetchCall(API_URL_ENUM + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(variables),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                `Failed to fetch data: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching database:', error);
        throw error;
    }
};

export const fetchLimitedDatabase = async (variables: any) => {
    const path = '/api/database/limited';
    const api = API_URL_ENUM + path;

    if (!api) return;

    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(variables),
    });

    const resp = await response.json();

    return resp;
};


export const fetchBlogPosts = async (isServerRequest = false) => {
    const path = '/api/blogs';
    const api = API_URL_ENUM + path;


    if (!api) return;

    const response = await fetch(api, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    const resp = await response.json();

    return resp;
};


export const fetchTestimonials = async () => {
    const path = '/api/testimonials?populate=profile_picture';
    const api = API_URL_ENUM + path;

    if (!api) return;

    const response = await fetch(api, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    const resp = await response.json();

    return resp;
}
export const fetchFilterOptions = async () => {
    const path = '/api/filteroption';
    const api = API_URL_ENUM + path;

    if (!api) return;

    const response = await fetch(api, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    const resp = await response.json();

    return resp;
}


export const handleGetAccess = async (priceId: string, successUrl: string, cancelUrl: string, referralId?: string, mode?: string) => {
    const api = API_URL_ENUM + '/api/webhook/create';
    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: priceId,
                successUrl: successUrl,
                cancelUrl: cancelUrl,
                referralId: referralId,
                mode: mode,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText); // Debug log
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const { sessionUrl } = await response.json();
        if (sessionUrl) {
            window.location.href = sessionUrl;
        } else {
            throw new Error('No session URL returned');
        }
    } catch (error) {
        console.error('Error in handleGetAccess:', error);
        throw error; // Re-throw the error to be caught in the component
    }
};


export const getAllProducts = async (): Promise<ProductResponse | ErrorResponse> => {
    const path = '/api/products';
    const api = API_URL_ENUM + path;


    try {
        if (!API_URL_ENUM) {
            throw new Error('Backend URL is not configured');
        }
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                `Failed to fetch products (${response.status})`
            );
        }

        const data = await response.json();
        return data as ProductResponse;

    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            success: false,
            error: error instanceof Error ?
                error.message :
                'An unexpected error occurred while fetching products'
        };
    }
};

export const setGithubAccess = async (githubUsername: string, token: string) => {
    const path = '/api/webhook/setGithub';
    const api = API_URL_ENUM + path;

    if (!api) {
        console.error('Backend URL is not defined');
        return;
    }

    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ github: githubUsername, userid: token }),
        });

        if (!response.ok) {
            throw new Error(`Failed to set GitHub access: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error setting GitHub access:', error);
        throw error;
    }
}

export const sendLoginLink = async (email: string): Promise<FetchResponse> => {
    const path = '/api/webhook/sendLoginLink';
    const api = API_URL_ENUM + path;

    if (!api) {
        return {
            success: false,
            message: 'Configuration error',
            error: 'Backend URL is not defined'
        };
    }

    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: 'Failed to send login link',
                error: result.error.message || `${response.status} ${response.statusText}`
            };
        }

        return {
            success: true,
            message: result.message || 'Login link sent successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to send login link',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

export const verifyToken = async (token: string, signal: AbortSignal) => {
    const path = '/api/webhook/verifyToken';
    const api = API_URL_ENUM + path;

    if (!api) {
        console.error('Backend URL is not defined');
        return { valid: false };
    }

    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            signal: signal,
        });

        // Handle unauthorized response
        if (response.status === 401) {
            Cookies.remove('authToken');
            return { valid: false, unauthorized: true };
        }

        // The middleware will have already handled token refresh
        // and set the X-New-Token header if needed
        const newToken = response.headers.get('X-New-Token');
        if (newToken) {
            Cookies.set('authToken', newToken, {
                expires: 2 / 24, // 2 hours
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            });
        }

        // Handle other non-200 responses
        if (!response.ok) {
            console.error('Token verification failed:', response.status, response.statusText);
            return { valid: false, error: `${response.status} ${response.statusText}` };
        }
        const data = await response.json();
        return { valid: true, user: data.user };
    } catch (error) {
        console.error('Error verifying token:', error);
        return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export const getAllFaqs = async () => {
    const path = '/api/faqs';
    const api = API_URL_ENUM + path;

    if (!api) {
        console.error('Backend URL is not defined');
        return;
    }

    try {
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch FAQs: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        throw error;
    }
}
export const getConfig = async () => {
    const path = '/api/config';
    const api = API_URL_ENUM + path;

    if (!api) {
        console.error('Backend URL is not defined');
        return;
    }

    try {
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching config:', error);
        throw error;
    }
}

export const sendContactUs = async (data: { name: string; email: string; message: string; captchaToken: string }) => {
    const path = '/api/webhook/contactus';
    const api = API_URL_ENUM + path;

    if (!api) {
        console.error('Backend URL is not defined');
        throw new Error('Backend URL is not defined');
    }

    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send contact us message: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const result = await response.json();
        if (result.success) {
            return { success: true, message: 'Contact form submitted successfully' };
        } else {
            throw new Error(result.message || 'Failed to process contact form');
        }
    } catch (error) {
        console.error('Error sending contact us message:', error);
        throw error;
    }
}


export const isLoggedIn = () => {
    const token = Cookies.get('authToken');
    return token !== undefined;
}

export const fetchPopularSearches = async () => {
    const response = await fetch(
        `${API_URL_ENUM}/api/popular-searches?sort[0]=order:asc&filters[isActive][$eq]=true`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return response.json();
};

export const exportDatabase = async (params: FilterParams, authToken: string, deliveryMethod: 'download' | 'email' = 'download') => {
    const response = await fetch(API_URL_ENUM + "/api/database/export", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            filteredOptions: params.filteredOptions,
            searchTerm: params.searchTerm,
            sorting: params.sorting,
            deliveryMethod,
            exportType: params.type
        }),
    });

    if (!response.ok) {
        throw new Error("Export failed");
    }

    // Check if the response is a CSV file
    const contentType = response.headers.get('content-type');
    if (contentType && (contentType.includes('text/csv') || contentType.includes('application/octet-stream'))) {
        const blob = await response.blob();
        return { type: 'file', data: blob, filename: response.headers.get('content-disposition')?.split('filename=')[1] };
    }

    // Otherwise, it's a JSON response
    const data = await response.json();
    return { type: 'json', ...data };
};

export const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // header row
        ...data.map(row =>
            headers.map(header => {
                const cell = row[header] || '';
                // Escape quotes and wrap in quotes if contains comma
                const escaped = cell.toString().replace(/"/g, '""');
                return escaped.includes(',') ? `"${escaped}"` : escaped;
            }).join(',')
        )
    ];

    return csvRows.join('\n');
};

export const tierSettings = async () => {
    const response = await fetchWithAuth(API_URL_ENUM + "/api/me/tier-config");
    return response.json();
}

