import { Api } from '@/AdminService/Api';
import { loginFailure } from '@Apps/Auth/redux/userProfile/userProfileSlice';

export const apiMiddleware = async (dispatch, next) => {
    const check = await Api.authApi.checkIsAuth();

    if (!check.result) {
        dispatch(loginFailure({ error: check.error }));

        return null;
    }

    return await next();
};
