import config from '@Services/api/config';

import { checkObject, checkString } from '@Services/utils/check';

const ApiObj = {
    config: config,
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
