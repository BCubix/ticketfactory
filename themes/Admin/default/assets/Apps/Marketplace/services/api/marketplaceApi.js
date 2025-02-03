import { Api } from '@/AdminService/Api';
import axios from '@Services/api/config';

const DEFAULT_PATH = '/marketplace';

const marketplaceApi = {
    marketplaceLogin: async (data) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/sign-in`, {
                username: data.username,
                password: data.password,
            });

            localStorage.setItem('marketplace_token', result.data.token);
            localStorage.setItem('marketplace_refresh_token', result.data.refresh_token);
            localStorage.setItem('marketplace_time_token', Date.now());

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    refreshConnexionToken: async (refreshToken = null) => {
        const refresh_token = refreshToken || localStorage.getItem('refresh_token');

        if (!refresh_token) {
            return { result: false };
        }

        try {
            const formData = new FormData();

            formData.append('refresh_token', refresh_token);

            const result = await axios.post(`${DEFAULT_PATH}/refresh-token`, formData);

            localStorage.setItem('marketplace_token', result.data.token);
            localStorage.setItem('marketplace_refresh_token', result.data.refresh_token);
            localStorage.setItem('marketplace_time_token', Date.now());

            return { result: true, token: result?.data?.token };
        } catch {
            localStorage.removeItem('marketplace_token');
            localStorage.removeItem('marketplace_refresh_token');
            localStorage.removeItem('marketplace_time_token');

            return { result: false };
        }
    },

    checkIsAuth: async () => {
        const timeToken = localStorage.getItem('marketplace_time_token');
        const token = localStorage.getItem('marketplace_token');
        const refresh_token = localStorage.getItem('marketplace_refresh_token');

        if (!refresh_token) {
            localStorage.removeItem('marketplace_token');
            localStorage.removeItem('marketplace_time_token');

            return { result: false };
        }

        const limitDate = new Date(parseInt(timeToken) + 1 * 60 * 60 * 1000);

        if (!token || Date.now() > limitDate) {
            return await Api.marketplaceApi.refreshConnexionToken(refresh_token);
        }

        return { result: true };
    },
};

export default marketplaceApi;
