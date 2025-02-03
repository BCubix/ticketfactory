import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

const initialState = {
    loading: false,
    error: null,
    milestones: null,
};

const milestonesSlice = createSlice({
    name: 'milestones',
    initialState: initialState,
    reducers: {
        getMilestones: (state) => {
            state.loading = true;
        },

        getMilestonesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.milestones = action.payload.milestones;
        },

        getMilestonesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.milestones = null;
        },

        resetMilestones: (state) => {
            state = { ...initialState };
        },
    },
});

export function getMilestonesAction() {
    return async (dispatch) => {
        try {
            dispatch(getMilestones());

            const milestones = await Api.milestonesApi.getMilestones();

            if (!milestones.result) {
                dispatch(getMilestonesFailure({ error: milestones.error }));

                return;
            }

            dispatch(getMilestonesSuccess({ milestones: milestones.milestones }));
        } catch (error) {
            dispatch(getMilestonesFailure({ error: error.message || error }));
        }
    };
}

export const { getMilestones, getMilestonesSuccess, getMilestonesFailure, resetMilestones } = milestonesSlice.actions;
export const milestonesSelector = (state) => state.milestones;
export default milestonesSlice.reducer;

