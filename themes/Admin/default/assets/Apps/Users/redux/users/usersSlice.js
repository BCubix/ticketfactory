import { createSlice } from '@reduxjs/toolkit';
import { Api } from "@/AdminService/Api";
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    users: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('usersActiveFilter')),
        email: sessionStorage.getItem('usersEmailFilter') || '',
        firstName: sessionStorage.getItem('usersFirstNameFilter') || '',
        lastName: sessionStorage.getItem('usersLastNameFilter') || '',
        role: sessionStorage.getItem('usersRoleFilter') || '',
        sort: sessionStorage.getItem('usersSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const usersSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        getUsers: (state) => {
            state.loading = true;
        },

        getUsersSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.users = action.payload.users;
            state.total = action.payload.total;
        },

        getUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.users = null;
        },

        resetUsers: (state) => {
            state = { ...initialState };
        },

        updateUsersFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getUsersAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getUsers());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().users?.filters;

                const users = await Api.usersApi.getUsers(state);
                if (!users.result) {
                    dispatch(getUsersFailure({ error: users.error }));

                    return;
                }

                dispatch(getUsersSuccess({ users: users.users, total: users.total }));
            });
        } catch (error) {
            dispatch(getUsersFailure({ error: error.message || error }));
        }
    };
}

export function changeUsersFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('usersActiveFilter', filters?.active);
        sessionStorage.setItem('usersEmailFilter', filters?.email);
        sessionStorage.setItem('usersFirstNameFilter', filters?.firstName);
        sessionStorage.setItem('usersLastNameFilter', filters?.lastName);
        sessionStorage.setItem('usersRoleFilter', filters?.role);
        sessionStorage.setItem('usersSort', filters?.sort);

        filters.page = page;

        dispatch(updateUsersFilters({ filters: filters }));
        dispatch(getUsersAction(filters));
    };
}

export const { getUsers, getUsersSuccess, getUsersFailure, resetUsers, updateUsersFilters } =
    usersSlice.actions;
export const usersSelector = (state) => state.users;
export default usersSlice.reducer;
