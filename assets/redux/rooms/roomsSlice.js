import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import roomsApi from '../../services/api/roomsApi';
import { apiMiddleware } from '../../services/utils/apiMiddleware';
import { getBooleanFromString } from '../../services/utils/getBooleanFromString';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    rooms: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('roomsActiveFilter')),
        name: sessionStorage.getItem('roomsNameFilter') || '',
        sort: sessionStorage.getItem('roomsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
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
            state.total = action.payload.total;
        },

        getRoomsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.rooms = null;
        },

        resetRooms: (state) => {
            state = { ...initialState };
        },

        updateRoomsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getRoomsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getRooms());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().rooms?.filters;

                const rooms = await roomsApi.getRooms(state);
                if (!rooms.result) {
                    dispatch(getRoomsFailure({ error: rooms.error }));

                    return;
                }

                dispatch(getRoomsSuccess({ rooms: rooms.rooms, total: rooms.total }));
            });
        } catch (error) {
            dispatch(getRoomsFailure({ error: error.message || error }));
        }
    };
}

export function changeRoomsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('roomsActiveFilter', filters?.active);
        sessionStorage.setItem('roomsNameFilter', filters?.name);
        sessionStorage.setItem('roomsSort', filters?.sort);

        filters.page = page;

        dispatch(updateRoomsFilters({ filters: filters }));
        dispatch(getRoomsAction(filters));
    };
}

export const { getRooms, getRoomsSuccess, getRoomsFailure, resetRooms, updateRoomsFilters } =
    roomsSlice.actions;
export const roomsSelector = (state) => state.rooms;
export default roomsSlice.reducer;
