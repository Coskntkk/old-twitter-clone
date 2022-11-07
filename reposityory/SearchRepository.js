import Repository from "./Repository";

class SearchRepostiyory {
    async search(keyword) {
        const reponse = await Repository.get(`/api/search/${keyword}`);
        return reponse;
    };
}

export default new SearchRepostiyory();
