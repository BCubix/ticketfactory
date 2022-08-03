import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import roomsApi from '../../services/api/roomsApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    rooms: null,
};

const roomsSlice = createSlice({
    name: 'rooms',
    initialState: initialState,
    reducers: {
        getRooms: (state) => {
            state.loading = true;
        },

        getRoomsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.rooms = action.payload.rooms;
        },

        getRoomsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.rooms = null;
        },

        resetRooms: (state) => {
            state = { ...initialState };
        },
    },
});

export function getRoomsAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getRooms());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const rooms = await roomsApi.getRooms(data);

            if (!rooms.result) {
                dispatch(getRoomsFailure({ error: rooms.error }));

                return;
            }

            dispatch(getRoomsSuccess({ rooms: rooms.rooms }));
        } catch (error) {
            dispatch(getRoomsFailure({ error: error.message || error }));
        }
    };
}

export const { getRooms, getRoomsSuccess, getRoomsFailure, resetRooms } = roomsSlice.actions;
export const roomsSelector = (state) => state.rooms;
export default roomsSlice.reducer;
