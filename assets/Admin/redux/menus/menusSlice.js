import { createSlice } from '@reduxjs/toolkit';
import { Api } from "@/AdminService/Api";
import { loginFailure } from '@Redux/profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    menus: null,
};

const menusSlice = createSlice({
    name: 'menus',
    initialState: initialState,
    reducers: {
        getMenus: (state) => {
            state.loading = true;
        },

        getMenusSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.menus = action.payload.menus;
        },

        getMenusFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.menus = null;
        },

        resetMenus: (state) => {
            state = { ...initialState };
        },
    },
});

export function getMenusAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getMenus());

            const response = await Api.authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const menus = await Api.menusApi.getMenus(data);

            if (!menus.result) {
                dispatch(getMenusFailure({ error: menus.error }));

                return;
            }

            dispatch(getMenusSuccess({ menus: menus.menus }));
        } catch (error) {
            dispatch(getMenusFailure({ error: error.message || error }));
        }
    };
}

export const { getMenus, getMenusSuccess, getMenusFailure, resetMenus } = menusSlice.actions;
export const menusSelector = (state) => state.menus;
export default menusSlice.reducer;
