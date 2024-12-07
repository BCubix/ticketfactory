import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    notifications: null,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
        getNotifications: (state) => {
            state.loading = true;
        },

        getNotificationsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.notifications = action.payload.notifications;
        },

        getNotificationsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.notifications = null;
        },

        resetNotifications: (state) => {
            state = { ...initialState };
        },
    },
});

export function getNotificationsAction() {
    return async (dispatch, getState) => {
        try {
            dispatch(getNotifications());

            apiMiddleware(dispatch, async () => {
                let lastNotificationId = null;

                const state = getState().notifications?.notifications;
                if (state?.length > 0) {
                    lastNotificationId = state?.at(-1);
                }

                const notifications = await Api.notificationsApi.getNotifications({ lastNotificationId });
                if (!notifications.result) {
                    dispatch(getNotificationsFailure({ error: notifications.error }));

                    return;
                }

                dispatch(getNotificationsSuccess({ notifications: notifications.notifications }));
            });
        } catch (error) {
            dispatch(getNotificationsFailure({ error: error.message || error }));
        }
    };
}

export const { getNotifications, getNotificationsSuccess, getNotificationsFailure, resetNotifications } = notificationsSlice.actions;
export const notificationsSelector = (state) => state.notifications;
export default notificationsSlice.reducer;
