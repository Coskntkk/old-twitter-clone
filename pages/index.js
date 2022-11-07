import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/authContext";
import HomePage from "../components/HomePage/HomePage"

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/feed");
    }
  }, [isAuthenticated]);
  return (
    <HomePage />
  )
}
