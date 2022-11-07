import Repository from "./Repository";

class FollowRepository {
    async follow(userId) {
        const reponse = await Repository.post("/api/actions/follow", { userId: userId });
        return reponse;
    }
    async unfollow(userId) {
        const reponse = await Repository.post("/api/actions/unfollow", { userId: userId });
        return reponse;
    }
    async getFollowers(username) {
        const response = await Repository.get(`/api/users/${username}/followers`);
        return response;
    }
    async getFollowing(username) {
        const response = await Repository.get(`/api/users/${username}/followings`);
        return response;
    }
}

export default new FollowRepository();
