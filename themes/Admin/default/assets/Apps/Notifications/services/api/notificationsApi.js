import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';

const DEFAULT_PATH = '/notifications';

var controller = null;

const notificationsApi = {
    getNotifications: async (filters) => {
        try {
            let params = {};
            if (filters?.lastNotificationId) {
                params['filters[lastNotificationId'] = filters?.lastNotificationId;
            }

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, notifications: result.data };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, notifications: [] };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getOneNotification: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, notification: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteNotification: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default notificationsApi;
