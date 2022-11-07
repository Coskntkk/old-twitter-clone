import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/authContext";
import Register from "../components/Register/Register";

const RegisterPage = () => {
    const router = useRouter();
    const { isAuthenticated } = useContext(AuthContext);
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/feed");
        }
    }, [isAuthenticated]);
    return (
        <Register />
    )
}

export default RegisterPage