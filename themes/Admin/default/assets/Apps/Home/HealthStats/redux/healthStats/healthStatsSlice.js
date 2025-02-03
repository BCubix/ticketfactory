import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

const initialState = {
    loadingHealthStats: false,
    errorHealthStats: null,
    healthStats: null,
};

const healthStatsSlice = createSlice({
    name: 'healthStats',
    initialState: initialState,
    reducers: {
        getHealthStats: (state) => {
            state.loadingHealthStats = true;
        },

        getHealthStatsSuccess: (state, action) => {
            state.loadingHealthStats = false;
            state.errorHealthStats = null;
            state.healthStats = action.payload.healthStats;
        },

        getHealthStatsFailure: (state, action) => {
            state.loadingHealthStats = false;
            state.errorHealthStats = action.payload.error;
            state.healthStats = null;
        },

        resetHealthStats: (state) => {
            state = { ...initialState };
        },
    },
});

export function getHealthStatsAction() {
    return async (dispatch) => {
        try {
            dispatch(getHealthStats());

            const healthStats = await Api.healthStatsApi.getHealthStats();

            if (!healthStats.result) {
                dispatch(getHealthStatsFailure({ error: healthStats.error }));

                return;
            }

            dispatch(getHealthStatsSuccess({ healthStats: healthStats.healthStats }));
        } catch (error) {
            dispatch(getHealthStatsFailure({ error: error.message || error }));
        }
    };
}

export const { getHealthStats, getHealthStatsSuccess, getHealthStatsFailure, resetHealthStats } = healthStatsSlice.actions;
export const healthStatsSelector = (state) => state.healthStats;
export default healthStatsSlice.reducer;

