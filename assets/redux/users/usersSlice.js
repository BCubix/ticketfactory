import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import usersApi from '../../services/api/usersApi';
import { loginFailure } from '../profile/profileSlice';

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        loading: false,
        error: null,
        users: null,
    },
    reducers: {
        getUsers: (state) => {
            state.loading = true;
        },

        getUsersSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.users = action.payload.users;
        },

        getUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.users = null;
        },
    },
});

export function getUsersAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getUsers());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const users = await usersApi.getUsers(data);

            if (!users.result) {
                dispatch(getUsersFailure({ error: users.error }));

                return;
            }

            dispatch(getUsersSuccess({ users: users.users }));
        } catch (error) {
            dispatch(getUsersFailure({ error: error.message || error }));
        }
    };
}

export const { getUsers, getUsersSuccess, getUsersFailure } = usersSlice.actions;
export const usersSelector = (state) => state.users;
export default usersSlice.reducer;
