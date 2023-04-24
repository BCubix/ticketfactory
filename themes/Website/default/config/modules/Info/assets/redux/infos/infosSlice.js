import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@/services/utils/apiMiddleware';
import { getBooleanFromString } from '@/services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    infos: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('infosActiveFilter')),
        title: sessionStorage.getItem('infosTitleFilter') || '',
        sort: sessionStorage.getItem('infosSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const infosSlice = createSlice({
    name: 'infos',
    initialState: initialState,
    reducers: {
        getInfos: (state) => {
            state.loading = true;
        },

        getInfosSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.infos = action.payload.infos;
            state.total = action.payload.total;
        },

        getInfosFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.infos = null;
        },

        resetInfos: (state) => {
            state = { ...initialState };
        },

        updateInfosFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getInfosAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getInfos());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().infos?.filters;

                const infos = await Api.infosApi.getInfos(state);
                if (!infos.result) {
                    dispatch(getInfosFailure({ error: infos.error }));
                    return;
                }

                dispatch(
                    getInfosSuccess({
                        infos: infos.infos,
                        total: infos.total,
                    })
                );
            });
        } catch (error) {
            dispatch(getInfosFailure({ error: error.message || error }));
        }
    };
}

export function changeInfosFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('infosActiveFilter', filters?.active);
        sessionStorage.setItem('infosTitleFilter', filters?.title);
        sessionStorage.setItem('infosSort', filters?.sort);

        filters.page = page;

        dispatch(updateInfosFilters({ filters: filters }));
        dispatch(getInfosAction(filters));
    };
}

export const {
    getInfos,
    getInfosSuccess,
    getInfosFailure,
    resetInfos,
    updateInfosFilters,
} = infosSlice.actions;
export const infosSelector = (state) => state.infos;
export default infosSlice.reducer;
