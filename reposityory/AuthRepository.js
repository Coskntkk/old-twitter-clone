import Repository from "./Repository";

class AuthRepository {
    async register(payload) {
        const reponse = await Repository.post("/api/auth/register", payload);
        return reponse;
    };
    async login(payload) {
        const reponse = await Repository.post("/api/auth/login", payload);
        return reponse;
    };
    async checkAuth(token) {
        const reponse = await Repository.post("/api/auth/check", {token: token});
        return reponse;
    }
}

export default new AuthRepository();
