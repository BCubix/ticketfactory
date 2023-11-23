import { checkComponent, checkObject, checkString } from '@Services/utils/check';

const AuthenticatedRouteObj = [];

/**
 * AuthenticatedRoute's getter.
 */
export const AuthenticatedRoute = new Proxy(AuthenticatedRouteObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in AuthenticatedRoute.`);
        }

        const result = Reflect.get(target, key, receiver);
        return typeof result === 'function' && result.name === '' ? result() : result;
    },
});

/**
 * AuthenticatedRoute's setter.
 *
 * @param  {string}   path
 * @param  {function} component
 * @param  {object}   option
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setAuthenticatedRoute(path, component, option = {}) {
    checkString(path);
    checkComponent(component);
    checkObject(option);

    const index = AuthenticatedRouteObj.findIndex((route) => route().path === path);
    if (index === -1) {
        AuthenticatedRouteObj.push(() => ({
            path: path,
            component: component,
            ...option,
        }));
    } else {
        AuthenticatedRouteObj[index] = () => ({
            path: path,
            component: component,
            ...option,
        });
    }
}
