import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { checkComponent, checkObject, checkString } from "@Services/utils/check";

const NonAuthenticatedRouteObj = [
    () => ({ path: Constant.LOGIN_PATH,           component: Component.Login }),
    () => ({ path: Constant.FORGOT_PASSWORD_PATH, component: Component.ForgotPassword }),
    () => ({ path: Constant.MODIFY_PASSWORD_PATH, component: Component.ChangePassword }),
];

/**
 * NonAuthenticatedRoute's getter.
 */
export const NonAuthenticatedRoute = new Proxy(NonAuthenticatedRouteObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in NonAuthenticatedRoute.`);
        }

        const result = Reflect.get(target, key, receiver);
        return typeof result === "function" && result.name === "" ? result() : result;
    }
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
export function setAuthenticatedRoute(path, component, option = {}) {
    checkString(path);
    checkComponent(component);
    checkObject(option);

    const index = NonAuthenticatedRouteObj.findIndex(route => route().path === path);
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
