// Hooks
import { createContext, useEffect, useState, useRef } from "react";
// import { alertError } from "hooks/useNotification";
// Next
import { useRouter } from "next/router";
// Services
import AuthRepository from "../reposityory/AuthRepository";

import Cookies from 'universal-cookie';
const cookies = new Cookies();

// Export the context
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    // Hooks
    const router = useRouter();
    // Loadings
    const [loading, setLoading] = useState(false);
    // User info
    const [userInfo, setUserInfo] = useState({
        _id: "",
        username: "",
        image: "",
        email: "",
        following: [],
        followers: [],
        favorites: [],
        lastTweet: "",
        followingImages: [],
        updates: [],
    });
    // User authentication control
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Authentication control function
    const checkAuth = () => {
        // Sends the request to auth service
        setLoading(true);
        // Get token from cookie
        const token = cookies.get('token');
        // If token is not empty
        AuthRepository.checkAuth(token)
            .then((res) => {
                // Set context states
                setIsAuthenticated(true);
                setUserInfo(res.data.user);
            })
            .catch(err => {
                // Error
                setIsAuthenticated(false);
                setUserInfo({
                    id: "",
                    username: "",
                    image: "",
                    email: "",
                    following: [],
                    followers: [],
                    favorites: [],
                    lastTweet: "",
                    followingImages: [],
                    updates: [],
                });
            })
            .finally(() => {
                // Set loading to false
                setLoading(false);
            });
    };

    // Logout function
    const logOut = () => {
        setLoading(true);
        // Set context states
        setIsAuthenticated(false);
        // Clear cookie
        cookies.remove('token');
        setUserInfo({
            id: "",
            username: "",
            image: "",
            email: "",
            following: [],
            followers: [],
            favorites: [],
            lastTweet: "",
            followingImages: [],
            updates: [],
        });
        // Redirect to home page
        setTimeout(() => {
            router.push('/');
        }, 10);
        // Set loading to false
        setLoading(false);
    }

    useEffect(() => {
        // Checks authentication
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ userInfo, isAuthenticated, setIsAuthenticated, logOut, setUserInfo, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider;