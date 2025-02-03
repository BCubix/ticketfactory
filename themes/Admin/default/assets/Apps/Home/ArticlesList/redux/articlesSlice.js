import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

export const articlesSlice = createSlice({
    name: 'articles',
    initialState: {
        articles: null,
        loadingArticles: false,
        errorArticles: null,
    },
    reducers: {
        setArticles: (state, action) => {
            state.articles = action.payload;
        },
        setLoading: (state, action) => {
            state.loadingArticles = action.payload;
        },
        setError: (state, action) => {
            state.errorArticles = action.payload;
        },
    },
});

export const fetchArticles = () => async dispatch => {
    dispatch(setLoading(true));
    try {
        const response = await Api.articlesApi.getArticles();
        dispatch(setArticles(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export default articlesSlice.reducer;
export const articlesSelector = (state) => state.articles;
export const {
    setArticles,
    setLoading,
    setError,
} = articlesSlice.actions;
