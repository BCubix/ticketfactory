import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    hooks: null,
};

const hooksSlice = createSlice({
    name: 'hooks',
    initialState: initialState,
    reducers: {
        getHooks: (state) => {
            state.loading = true;
        },

        getHooksSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.hooks = action.payload.hooks;
        },

        getHooksFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.hooks = null;
        },

        resetHooks: (state) => {
            state = { ...initialState };
        },
    },
});

export function getHooksAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getHooks());

            apiMiddleware(dispatch, async () => {
                const hooks = await Api.hooksApi.getHooks(data);
                if (!hooks.result) {
                    dispatch(getHooksFailure({ error: hooks.error }));

                    return;
                }

                dispatch(getHooksSuccess({ hooks: hooks.hooks, total: hooks.total }));
            });
        } catch (error) {
            dispatch(getHooksFailure({ error: error.message || error }));
        }
    };
}

export const { getHooks, getHooksSuccess, getHooksFailure, resetHooks } = hooksSlice.actions;
export const hooksSelector = (state) => state.hooks;
export default hooksSlice.reducer;
