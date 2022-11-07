/* eslint-disable @next/next/no-img-element */
// Context
import { AuthContext } from '../../context/authContext';
// Hooks
import { useContext } from 'react';
// Components
import Link from 'next/link';
// Repository
import FollowRepository from '../../reposityory/FollowRepository';

const User = ({ user, setRefresh, refresh }) => {
    // States & Context
    const { userInfo, isAuthenticated } = useContext(AuthContext);

    const follow = () => {
        // FavRepository.fav(tweet._id)
        //     .then(response => {
        //         if (response.data.success) {
        //             console.log('Tweet favorited');
        //         } else {
        //             console.log('Error favoriting tweet');
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        //     .finally(() => {
        //         setRefresh(!refresh);
        //     });
    };

    const unfollow = () => {
        // FavRepository.unfav(tweet._id)
        //     .then(response => {
        //         if (response.data.success) {
        //             console.log('Tweet unfavorited');
        //         } else {
        //             console.log('Error unfavoriting tweet');
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        //     .finally(() => {
        //         setRefresh(!refresh);
        //     });
    };

    return (
        <div className="container-fluid f-tweet-box">
            <img className="f-tweet-pp" src={`/images/${user.image}`} alt="" />
            <div className="col-9 f-tweet-content" style={{ wordBreak: 'break-word' }}>
                <Link href={`/users/${user.username}`}><b className="f-tweet-author"> {user.username} </b></Link>
                {user.role === 2 && <span style={{ color: "purple" }}>{" "}(👑)</span>}
                {user.role === 1 && <i style={{ color: "rgb(154, 228, 232)" }} className="fa-solid fa-circle-check"></i>}
                <div style={{ display: 'block' }}>
                    {isAuthenticated &&
                        user.isFollowing ?
                        <button className="follow-button" type="submit" name="button" onClick={unfollow}>Unfollow</button>
                        :
                        <button className="follow-button" type="submit" name="button" onClick={follow}>Follow</button>
                    }
                </div>
            </div>
            <hr className="f-tweet-hr" />
        </div>
    )
}

export default User