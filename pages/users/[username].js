// Import router
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// Components
import UserPage from '../../components/UserPage/UserPage';
import UserProfile from '../../components/UserProfile/UserProfile';
import Loading from '../../components/Loading/Loading';
// Context
import { AuthContext } from "../../context/authContext";

const UserPage2 = () => {
    // Pathname
    const router = useRouter();
    const username = router.query.username;
    // Context
    const { userInfo, loading } = useContext(AuthContext);
    // States
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (userInfo.username == username) {
            setIsOwner(true);
            router.push('/profile');
        }
    }, [loading]);
        
    return (
        <>{loading 
            ? <Loading /> 
            : isOwner 
                ? <Loading /> 
                : <UserPage username={username} />
        }</>
    )
}

export default UserPage2