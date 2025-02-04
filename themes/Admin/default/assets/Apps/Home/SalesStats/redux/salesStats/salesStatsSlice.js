import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

const initialState = {
    salesStatsLoading: false,
    salesStatsError: null,
    salesStats: null,
};

const salesStatsSlice = createSlice({
    name: 'salesStats',
    initialState: initialState,
    reducers: {
        getSalesStats: (state) => {
            state.salesStatsLoading = true;
        },

        getSalesStatsSuccess: (state, action) => {
            state.salesStatsLoading = false;
            state.salesStatsError = null;
            state.salesStats = action.payload.salesStats;
        },

        getSalesStatsFailure: (state, action) => {
            state.salesStatsLoading = false;
            state.salesStatsError = action.payload.error;
            state.salesStats = null;
        },

        resetSalesStats: (state) => {
            state = { ...initialState };
        },
    },
});

export function getSalesStatsAction(beginDate, endDate) {
    return async (dispatch) => {
        try {
            dispatch(getSalesStats());

            const salesStats = await Api.salesStatsApi.getGraph(beginDate, endDate);

            if (!salesStats.result) {
                dispatch(getSalesStatsFailure({ error: salesStats.error }));

                return;
            }

            dispatch(getSalesStatsSuccess({ salesStats: salesStats.salesStats }));
        } catch (error) {
            dispatch(getSalesStatsFailure({ error: error.message || error }));
        }
    };
}

export const { getSalesStats, getSalesStatsSuccess, getSalesStatsFailure, resetSalesStats } = salesStatsSlice.actions;
export const salesStatsSelector = (state) => state.salesStats;
export default salesStatsSlice.reducer;

