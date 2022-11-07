import Repository from "./Repository";

class FavRepository {
    async fav(tweetId) {
        const reponse = await Repository.post("/api/actions/favorite", { tweetId: tweetId });
        return reponse;
    }
    async unfav(tweetId) {
        const reponse = await Repository.post("/api/actions/unfavorite", { tweetId: tweetId });
        return reponse;
    }
    async getFavs(username) {
        const response = await Repository.get(`/api/users/${username}/favorites`);
        return response;
    }
}

export default new FavRepository();
