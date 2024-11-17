import config from '@Services/api/config';
import authApi from '@Services/api/authApi';
import userProfileApi from '@Services/api/userProfileApi';

import { checkObject, checkString } from '@Services/utils/check';

const ApiObj = {
    config: config,
    authApi: authApi,
    userProfileApi: userProfileApi,
};

/**
 * Api's getter.
 */
export const Api = new Proxy(ApiObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in Menu.`);
        }

        return Reflect.get(target, key, receiver);
    },
});

/**
 * Api's setter.
 *
 * @param  {string} name
 * @param  {object} api
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setApi(name, api) {
    checkString(name);
    checkObject(api);

    ApiObj[name] = api;
}
