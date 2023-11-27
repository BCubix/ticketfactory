import { checkComponent, checkObject, checkString } from '@Services/utils/check';

const NonAuthenticatedRouteObj = [];

/**
 * NonAuthenticatedRoute's getter.
 */
export const NonAuthenticatedRoute = new Proxy(NonAuthenticatedRouteObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in NonAuthenticatedRoute.`);
        }

        const result = Reflect.get(target, key, receiver);
        return typeof result === 'function' && result.name === '' ? result() : result;
    },
});

/**
 * NonAuthenticatedRoute's setter.
 *
 * @param  {string}   path
 * @param  {function} component
 * @param  {object}   option
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setNonAuthenticatedRoute(path, component, option = {}) {
    checkString(path);
    checkComponent(component);
    checkObject(option);

    const index = NonAuthenticatedRouteObj.findIndex((route) => route().path === path);
    if (index === -1) {
        NonAuthenticatedRouteObj.push(() => ({
            path: path,
            component: component,
            ...option,
        }));
    } else {
        NonAuthenticatedRouteObj[index] = () => ({
            path: path,
            component: component,
            ...option,
        });
    }
}
