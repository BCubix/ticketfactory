import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    profiles: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('profilesActiveFilter')),
        name: sessionStorage.getItem('profilesNameFilter') || '',
        sort: sessionStorage.getItem('profilesSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const profilesSlice = createSlice({
    name: 'profiles',
    initialState: initialState,
    reducers: {
        getProfiles: (state) => {
            state.loading = true;
        },

        getProfilesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.profiles = action.payload.profiles;
            state.total = action.payload.total;
        },

        getProfilesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.profiles = null;
        },

        resetProfiles: (state) => {
            state = { ...initialState };
        },

        updateProfilesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getProfilesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getProfiles());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().profiles?.filters;

                const profiles = await Api.profilesApi.getProfiles(state);
                if (!profiles.result) {
                    dispatch(getProfilesFailure({ error: profiles.error }));

                    return;
                }

                dispatch(getProfilesSuccess({ profiles: profiles.profiles, total: profiles.total }));
            });
        } catch (error) {
            dispatch(getProfilesFailure({ error: error.message || error }));
        }
    };
}

export function changeProfilesFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('profilesActiveFilter', filters?.active);
        sessionStorage.setItem('profilesNameFilter', filters?.name);
        sessionStorage.setItem('profilesSort', filters?.sort);

        filters.page = page;

        dispatch(updateProfilesFilters({ filters: filters }));
        dispatch(getProfilesAction(filters));
    };
}

export const { getProfiles, getProfilesSuccess, getProfilesFailure, resetProfiles, updateProfilesFilters } = profilesSlice.actions;
export const profilesSelector = (state) => state.profiles;
export default profilesSlice.reducer;
