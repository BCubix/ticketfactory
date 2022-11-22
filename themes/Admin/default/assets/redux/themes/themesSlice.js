import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    themes: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('themesActiveFilter')),
        name: sessionStorage.getItem('themesNameFilter') || '',
        sort: sessionStorage.getItem('themesSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
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
            state.total = action.payload.total;
        },

        getThemesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.themes = null;
        },

        resetThemes: (state) => {
            state = { ...initialState };
        },

        updateThemesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getThemesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getThemes());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().themes?.filters;

                const themes = await Api.themesApi.getThemes(state);
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

export function changeThemesFilters(filters, theme = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('themesActiveFilter', filters?.active);
        sessionStorage.setItem('themesNameFilter', filters?.name);
        sessionStorage.setItem('themesSort', filters?.sort);

        filters.theme = theme;

        dispatch(updateThemesFilters({ filters: filters }));
        dispatch(getThemesAction(filters));
    };
}

export const { getThemes, getThemesSuccess, getThemesFailure, resetThemes, updateThemesFilters } =
    themesSlice.actions;
export const themesSelector = (state) => state.themes;
export default themesSlice.reducer;
