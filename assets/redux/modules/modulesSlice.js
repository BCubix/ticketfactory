import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    modules: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('modulesActiveFilter')),
        name: sessionStorage.getItem('modulesNameFilter') || '',
        sort: sessionStorage.getItem('modulesSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
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
            state.total = action.payload.total;
        },

        getModulesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.modules = null;
        },

        resetModules: (state) => {
            state = { ...initialState };
        },

        updateModulesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getModulesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getModules());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().modules?.filters;

                const modules = await Api.modulesApi.getModules(state);
                if (!modules.result) {
                    dispatch(getModulesFailure({ error: modules.error }));

                    return;
                }

                dispatch(getModulesSuccess({ modules: modules.modules, total: modules.total }));
            });
        } catch (error) {
            dispatch(getModulesFailure({ error: error.message || error }));
        }
    };
}

export function changeModulesFilters(filters, module = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('modulesActiveFilter', filters?.active);
        sessionStorage.setItem('modulesNameFilter', filters?.name);
        sessionStorage.setItem('modulesSort', filters?.sort);

        filters.module = module;

        dispatch(updateModulesFilters({ filters: filters }));
        dispatch(getModulesAction(filters));
    };
}

export const { getModules, getModulesSuccess, getModulesFailure, resetModules, updateModulesFilters } =
    modulesSlice.actions;
export const modulesSelector = (state) => state.modules;
export default modulesSlice.reducer;
