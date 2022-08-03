import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import seasonsApi from '../../services/api/seasonsApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    seasons: null,
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
        },

        getSeasonsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.seasons = null;
        },

        resetSeasons: (state) => {
            state = { ...initialState };
        },
    },
});

export function getSeasonsAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getSeasons());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const seasons = await seasonsApi.getSeasons(data);

            if (!seasons.result) {
                dispatch(getSeasonsFailure({ error: seasons.error }));

                return;
            }

            dispatch(getSeasonsSuccess({ seasons: seasons.seasons }));
        } catch (error) {
            dispatch(getSeasonsFailure({ error: error.message || error }));
        }
    };
}

export const { getSeasons, getSeasonsSuccess, getSeasonsFailure, resetSeasons } =
    seasonsSlice.actions;
export const seasonsSelector = (state) => state.seasons;
export default seasonsSlice.reducer;
