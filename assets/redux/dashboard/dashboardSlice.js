import { createSlice } from '@reduxjs/toolkit';
import { loginFailure } from '../profile/profileSlice';
import authApi from '../../services/api/authApi';
import dashboardApi from '../../services/api/dashboardApi';

const initialState = {
    loading: false,
    error: null,
    dashboard: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: initialState,
    reducers: {
        getDashboard: (state) => {
            state.loading = true;
        },

        getDashboardSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.dashboard = action.payload.dashboard;
        },

        getDashboardFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.dashboard = null;
        },

        resetDashboard: (state) => {
            state = { ...initialState };
        },
    },
});

export function getDashboardAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getDashboard());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const dashboard = await dashboardApi.getDashboard(data);

            if (!dashboard.result) {
                dispatch(getDashboardFailure({ error: dashboard.error }));

                return;
            }

            dispatch(getDashboardSuccess({ dashboard: dashboard.dashboard }));
        } catch (error) {
            dispatch(getDashboardFailure({ error: error.message || error }));
        }
    };
}

export const { getDashboard, getDashboardSuccess, getDashboardFailure, resetDashboard } =
    dashboardSlice.actions;
export const dashboardSelector = (state) => state.dashboard;
export default dashboardSlice.reducer;