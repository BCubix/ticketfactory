import axios from '@Services/api/config';

const ARTICLES_BASE_PATH = '/articles';

const articlesApi = {
    getArticles: async () => {
        const result = await axios.get(ARTICLES_BASE_PATH);
        return result;
    },
    
};

export default articlesApi;