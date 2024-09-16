import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    addonVersionsLoading: false,
    addonVersionsError: null,
    addonVersions: null,
};

const addonVersionsSlice = createSlice({
    name: 'addonVersions',
    initialState: initialState,
    reducers: {
        getAddonVersions: (state) => {
            state.moduleAddonLoading = true;
        },

        getAddonVersionsSuccess: (state, action) => {
            state.addonVersionsLoading = false;
            state.addonVersionsError = null;
            state.addonVersions = action.payload.addonVersions;
        },

        getAddonVersionsFailure: (state, action) => {
            state.addonVersionsLoading = false;
            state.addonVersionsError = action.payload.error;
            state.addonVersions = null;
        },

        resetAddonVersions: (state) => {
            state = { ...initialState };
        },
    },
});

export function getAddonVersionsAction() {
    return async (dispatch) => {
        try {
            dispatch(getAddonVersions());

            apiMiddleware(dispatch, async () => {
                const addonVersions = await Api.addonVersionsApi.getAddonVersions();
                if (!addonVersions.result) {
                    dispatch(getAddonVersionsFailure({ error: addonVersions.error }));

                    return;
                }

                dispatch(getAddonVersionsSuccess({ addonVersions: addonVersions.addonVersions }));
            });
        } catch (error) {
            dispatch(getAddonVersionsFailure({ error: error.message || error }));
        }
    };
}

export const { getAddonVersions, getAddonVersionsSuccess, getAddonVersionsFailure } = addonVersionsSlice.actions;
export const addonVersionsSelector = (state) => state.addonVersions;
export default addonVersionsSlice.reducer;
