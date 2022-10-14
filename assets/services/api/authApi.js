import axios from './config';

const authApi = {
    login: async (data) => {
        try {
            const result = await axios.post('/login_check', {
                username: data.username,
                password: data.password,
            });

            localStorage.setItem('token', result.data.token);
            localStorage.setItem('refresh_token', result.data.refresh_token);
            localStorage.setItem('time_token', Date.now());

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.token;

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

            const result = await axios.post('/token/refresh', formData);

            localStorage.setItem('token', result.data.token);
            localStorage.setItem('refresh_token', result.data.refresh_token);
            localStorage.setItem('time_token', Date.now());

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.token;

            return { result: true };
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('time_token');

            axios.defaults.headers.common['Authorization'] = '';

            return { result: false };
        }
    },

    checkIsAuth: async () => {
        const timeToken = localStorage.getItem('time_token');
        const token = localStorage.getItem('token');
        const refresh_token = localStorage.getItem('refresh_token');

        if (!refresh_token) {
            localStorage.removeItem('token');
            localStorage.removeItem('time_token');

            return { result: false };
        }

        const limitDate = new Date(parseInt(timeToken) + 1 * 60 * 60 * 1000);

        if (!token || Date.now() > limitDate) {
            return await authApi.refreshConnexionToken(refresh_token);
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { result: true };
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('time_token');

        axios.defaults.headers.common['Authorization'] = '';
    },

    forgotPassword: async (data) => {
        try {
            const result = await axios.post('/forgot-password', {
                username: data.username,
            });

            return { result: true, data: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    changePassword: async (data) => {
        try {
            let formData = new FormData();

            formData.append('username', data.username);
            formData.append('token', data.token);
            formData.append('newPassword', data.password);

            const result = await axios.post('/reset-password', formData);

            return { result: true, data: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default authApi;
