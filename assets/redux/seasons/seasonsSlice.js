import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import seasonsApi from '../../services/api/seasonsApi';
import { apiMiddleware } from '../../services/utils/apiMiddleware';
import { getBooleanFromString } from '../../services/utils/getBooleanFromString';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    seasons: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('seasonsActiveFilter')),
        name: sessionStorage.getItem('seasonsNameFilter') || '',
        sort: sessionStorage.getItem('seasonsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const seasonsSlice = createSlice({
    name: 'seasons',
    initialState: initialState,
    reducers: {
        getSeasons: (state) => {
            state.loading = true;
        },

        getSeasonsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.seasons = action.payload.seasons;
            state.total = action.payload.total;
        },

        getSeasonsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.seasons = null;
        },

        resetSeasons: (state) => {
            state = { ...initialState };
        },

        updateSeasonsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getSeasonsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getSeasons());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().rooms?.filters;

                const seasons = await seasonsApi.getSeasons(state);
                if (!seasons.result) {
                    dispatch(getSeasonsFailure({ error: seasons.error }));

                    return;
                }

                dispatch(getSeasonsSuccess({ seasons: seasons.seasons, total: seasons.total }));
            });
        } catch (error) {
            dispatch(getSeasonsFailure({ error: error.message || error }));
        }
    };
}

export function changeSeasonsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('seasonsActiveFilter', filters?.active);
        sessionStorage.setItem('seasonsNameFilter', filters?.name);
        sessionStorage.setItem('seasonsSort', filters?.sort);

        filters.page = page;

        dispatch(updateSeasonsFilters({ filters: filters }));
        dispatch(getSeasonsAction(filters));
    };
}

export const {
    getSeasons,
    getSeasonsSuccess,
    getSeasonsFailure,
    resetSeasons,
    updateSeasonsFilters,
} = seasonsSlice.actions;
export const seasonsSelector = (state) => state.seasons;
export default seasonsSlice.reducer;
