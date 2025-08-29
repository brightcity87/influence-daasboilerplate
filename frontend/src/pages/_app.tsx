// Import necessary components and types from Chakra UI and Next.js
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { createContext } from "react";
import "../styles/globals.css";
import { config, newTheme } from "../styles/theming";

// Import custom hook for user authentication
import useUserAuthentication from "@/hooks/useUserAuthentication";
import Head from "next/head";

// Extend the Chakra UI theme with custom configurations
export const theme = extendTheme({ ...newTheme, config });

// Create a context for authentication state
// This allows child components to access authentication information without prop drilling
export const AuthContext = createContext<{
  isLoggedIn: boolean;
  loading: boolean;
}>({ isLoggedIn: false, loading: true });

// Main App component that wraps all pages
const MyApp = ({ Component, pageProps }: AppProps) => {
  // Use the custom authentication hook to get user state
  const { loading, data, error } = useUserAuthentication();

  // Determine if user is logged in based on presence of data and absence of error
  const isLoggedIn = !!data && !error;

  return (
    // Provide the Chakra UI theme to all components
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ChakraProvider theme={theme}>
        {/* Provide authentication state to all child components */}
        <AuthContext.Provider value={{ isLoggedIn, loading }}>
          {/* Render the current page component */}
          <Component {...pageProps} />
        </AuthContext.Provider>
      </ChakraProvider>
    </>
  );
};

export default MyApp;
