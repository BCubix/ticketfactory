import axios, { Axios } from 'axios';
import { NotificationManager } from 'react-notifications';
import axiosRetry from 'axios-retry';
import { REDIRECTION_TIME } from '../../Constant';
import authApi from './authApi';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../../redux/profile/profileSlice';

let api_count = 0;

let api = axios.create({
    baseURL: '/admin/api',
    headers: {},
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;

        if (api_count === 3) {
            NotificationManager.error(
                'Une erreur est survenu, essayez de rafraichir la page.',
                'Erreur',
                REDIRECTION_TIME
            );
            api_count = 0;
        }

        if (status >= 500) {
            NotificationManager.error(
                'Une erreur est survenu, essayez de rafraichir la page.',
                'Erreur',
                REDIRECTION_TIME
            );
        }

        if (status === 401 && error?.config?.url !== '/token/refresh') {
            if (api_count === 3) {
                useDispatch(logoutAction());
            }

            const result = await authApi.refreshConnexionToken();
            if (!result?.result) {
                useDispatch(logoutAction());
            } else {
                error.config.headers['Authorization'] = 'Bearer ' + result.token;
            }
        }

        throw error;
    }
);

axiosRetry(api, {
    retries: 3,
    retryDelay: (retryCount) => {
        api_count = retryCount;

        return retryCount * 2000;
    },
    retryCondition: (error) => {
        if (!window.navigator.onLine) {
            return false;
        }

        if (error?.response?.status === 500) {
            return false;
        }

        return true;
    },
});

export default api;
