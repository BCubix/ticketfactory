import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    modules: null,
};

const modulesSlice = createSlice({
    name: 'modules',
    initialState: initialState,
    reducers: {
        getModules: (state) => {
            state.loading = true;
        },

        getModulesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.modules = action.payload.modules;
        },

        getModulesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.modules = null;
        },

        resetModules: (state) => {
            state = { ...initialState };
        },
    },
});

export function getModulesAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getModules());

            apiMiddleware(dispatch, async () => {
                const modules = await Api.modulesApi.getModules(data);
                if (!modules.result) {
                    dispatch(getModulesFailure({ error: modules.error }));

                    return;
                }

                dispatch(getModulesSuccess({ modules: modules.modules }));
            });
        } catch (error) {
            dispatch(getModulesFailure({ error: error.message || error }));
        }
    };
}

export const { getModules, getModulesSuccess, getModulesFailure, resetModules } =
    modulesSlice.actions;
export const modulesSelector = (state) => state.modules;
export default modulesSlice.reducer;
