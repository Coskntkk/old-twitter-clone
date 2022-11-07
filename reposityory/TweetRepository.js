import Repository from "./Repository";

class TweetRepostiyory {
    async newTweet(payload) {
        const reponse = await Repository.post("/api/tweet/new", payload);
        return reponse;
    };
    async getFeed(payload) {
        const reponse = await Repository.post("/api/tweet/feed", payload);
        return reponse;
    };
    async deleteTweet(payload) {
        const reponse = await Repository.post("/api/tweet/delete", payload);
        return reponse;
    };
}

export default new TweetRepostiyory();
