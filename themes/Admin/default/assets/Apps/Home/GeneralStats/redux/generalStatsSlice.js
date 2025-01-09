import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

const initialState = {
    loading: false,
    error: null,
    generalStats: [],
};

const generalStatsSlice = createSlice({
    name: 'generalStats',
    initialState: initialState,
    reducers: {
        setGeneralStats: (state, action) => {
            state.generalStats = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const getGeneralStatsData = (beginDate, endDate) => async dispatch => {
    dispatch(setLoading(true));
    try {
        const response = await Api.generalStatsApi.getGraph(beginDate, endDate);
        dispatch(setGeneralStats(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
}

export const {
    setGeneralStats,
    setLoading,
    setError,
} = generalStatsSlice.actions;
export default generalStatsSlice.reducer;
