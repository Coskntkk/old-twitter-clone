import Repository from "./Repository";

class userRepository {
    async getUser(username) {
        const reponse = await Repository.get(`/api/users/${username}`);
        return reponse;
    }
}

export default new userRepository();
