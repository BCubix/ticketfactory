import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    languages: null,
    total: null,
};

const languagesSlice = createSlice({
    name: 'languages',
    initialState: initialState,
    reducers: {
        getLanguages: (state) => {
            state.loading = true;
        },

        getLanguagesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.languages = action.payload.languages;
            state.total = action.payload.total;
        },

        getLanguagesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.languages = null;
            state.total = null;
        },

        resetLanguages: (state) => {
            state = { ...initialState };
        },
    },
});

export function getLanguagesAction() {
    return async (dispatch) => {
        try {
            dispatch(getLanguages());

            apiMiddleware(dispatch, async () => {
                const languages = await Api.languagesApi.getLanguages();
                if (!languages.result) {
                    dispatch(getLanguagesFailure({ error: languages.error }));

                    return;
                }

                dispatch(
                    getLanguagesSuccess({
                        languages: languages.languages,
                        total: languages.total,
                    })
                );
            });
        } catch (error) {
            dispatch(getImageFormatsFailure({ error: error.message || error }));
        }
    };
}

export const { getLanguages, getLanguagesSuccess, getLanguagesFailure, resetLanguages } = languagesSlice.actions;
export const languagesSelector = (state) => state.languages;
export default languagesSlice.reducer;
