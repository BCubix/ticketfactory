import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    themes: null,
};

const themesSlice = createSlice({
    name: 'themes',
    initialState: initialState,
    reducers: {
        getThemes: (state) => {
            state.loading = true;
        },

        getThemesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.themes = action.payload.themes;
        },

        getThemesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.themes = null;
        },

        resetThemes: (state) => {
            state = { ...initialState };
        },
    },
});

export function getThemesAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getThemes());

            apiMiddleware(dispatch, async () => {
                const themes = await Api.themesApi.getThemes(data);
                if (!themes.result) {
                    dispatch(getThemesFailure({ error: themes.error }));

                    return;
                }

                dispatch(getThemesSuccess({ themes: themes.themes, total: themes.total }));
            });
        } catch (error) {
            dispatch(getThemesFailure({ error: error.message || error }));
        }
    };
}

export const { getThemes, getThemesSuccess, getThemesFailure, resetThemes } = themesSlice.actions;
export const themesSelector = (state) => state.themes;
export default themesSlice.reducer;
