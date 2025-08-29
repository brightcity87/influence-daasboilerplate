import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifyToken } from "@/helpers";
import Cookies from "js-cookie";

// Custom hook for handling user authentication
const useUserAuthentication = () => {
  // State variables to manage loading, error, and user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Hooks for displaying toasts and handling routing
  const toast = useToast();
  const router = useRouter();
  const { token } = router.query;

  // Function to remove the token from the URL after processing
  const removeTokenFromURL = () => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("token")) {
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Function to handle user logout
  const logout = () => {
    setData(null);
    setError(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    router.push("/");
  };

  // Effect hook to handle authentication process
  useEffect(() => {
    const authenticateUser = async () => {
      // Check if there's a token in the URL
      if (token && typeof token === "string") {
        try {
          // Verify the token
          const result = await verifyToken(token, new AbortController().signal);
          if (result.valid) {
            setData(result.user);
            // Store the token in a cookie that expires in 7 days
            Cookies.set("authToken", token, { expires: 7 });
            toast({
              title: "Authentication Successful",
              description: "You have been logged in successfully.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          } else {
            throw new Error("Invalid token");
          }
        } catch (err) {
          setError("Authentication failed. Please try logging in again.");
          toast({
            title: "Authentication Failed",
            description: "There was an error logging you in. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // If no token in URL, check for a stored token in cookies
        const storedToken = Cookies.get("authToken");
        if (storedToken) {
          try {
            const result = await verifyToken(storedToken, new AbortController().signal);
            if (result.valid) {
              setData(result.user);
            } else {
              // Remove invalid token and set error
              setError("Session expired. Please log in again.");
            }
          } catch (err) {
            setError("Authentication failed. Please log in again.");
          }
        }
      }
      setLoading(false);
      removeTokenFromURL();
    };

    authenticateUser();
  }, [token, toast, router]);

  // Return the authentication state and logout function
  return { loading, data, error, logout };
};

export default useUserAuthentication;
