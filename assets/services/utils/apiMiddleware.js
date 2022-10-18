import { loginFailure } from '../../redux/profile/profileSlice';
import authApi from '../api/authApi';

export const apiMiddleware = async (dispatch, next) => {
    const check = await authApi.checkIsAuth();

    if (!check.result) {
        dispatch(loginFailure({ error: check.error }));

        return null;
    }

    return await next();
};
