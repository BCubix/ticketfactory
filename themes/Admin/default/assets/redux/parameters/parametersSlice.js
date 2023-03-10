import { createSlice } from '@reduxjs/toolkit';
import { Api } from "@/AdminService/Api";
import { loginFailure } from '@Redux/profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    parameters: null,
};

const parametersSlice = createSlice({
    name: 'parameters',
    initialState: initialState,
    reducers: {
        getParameters: (state) => {
            state.loading = true;
        },

        getParametersSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.parameters = action.payload.parameters;
        },

        getParametersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.parameters = null;
        },

        resetParameters: (state) => {
            state = { ...initialState };
        },
    },
});

export function getParametersAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getParameters());

            const response = await Api.authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const parameters = await Api.parametersApi.getParameters(data);

            if (!parameters.result) {
                dispatch(getParametersFailure({ error: parameters.error }));

                return;
            }

            dispatch(getParametersSuccess({ parameters: parameters.parameters }));
        } catch (error) {
            dispatch(getParametersFailure({ error: error.message || error }));
        }
    };
}

export const { getParameters, getParametersSuccess, getParametersFailure, resetParameters } = parametersSlice.actions;
export const parametersSelector = (state) => state.parameters;
export default parametersSlice.reducer;