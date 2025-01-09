import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    notifications: null,
    filters: {
        limit: 10,
    },
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

        setNotifications: (state, action) => {
            state.notifications = action.payload.notifications;
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
                let lastNotification = null;

                const notificationsList = [...(getState().notifications?.notifications || [])];
                if (notificationsList?.length > 0) {
                    lastNotification = notificationsList?.at(-1);
                }

                const notifications = await Api.notificationsApi.getNotifications({ lastNotification: lastNotification?.id });
                if (!notifications.result) {
                    dispatch(getNotificationsFailure({ error: notifications.error }));

                    return;
                }

                dispatch(getNotificationsSuccess({ notifications: [...notificationsList, ...notifications.notifications] }));
            });
        } catch (error) {
            dispatch(getNotificationsFailure({ error: error.message || error }));
        }
    };
}

export function readNotificationAction(notification) {
    return async (dispatch, getState) => {
        try {
            apiMiddleware(dispatch, async () => {
                const result = await Api.notificationsApi.readNotification(notification.id);
                if (!result?.result) {
                    return;
                }

                const notifications = [...getState().notifications?.notifications];
                let index = notifications?.findIndex((nt) => nt.id === notification?.id);
                if (index === -1) {
                    return;
                }

                notifications[index] = result?.notification;
                dispatch(setNotifications({ notifications: notifications }));
            });
        } catch (error) {
            return;
        }
    };
}

export function deleteNotificationAction(notification) {
    return async (dispatch, getState) => {
        try {
            apiMiddleware(dispatch, async () => {
                Api.notificationsApi.deleteNotification(notification.id);

                const notifications = [...getState().notifications?.notifications];
                let index = notifications?.findIndex((nt) => nt.id === notification?.id);
                if (index === -1) {
                    return;
                }

                notifications.splice(index, 1);
                dispatch(setNotifications({ notifications: notifications }));
            });
        } catch (error) {
            return;
        }
    };
}

export const { getNotifications, getNotificationsSuccess, getNotificationsFailure, setNotifications, resetNotifications } = notificationsSlice.actions;
export const notificationsSelector = (state) => state.notifications;
export default notificationsSlice.reducer;
