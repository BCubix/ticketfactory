import { Routing } from '@Website/Routing';
import { checkComponent, checkString } from '@WServices/utils/check';
import { Home } from '@WApps/Home/Home';
import { Layout } from '@WComponents/Layout/Layout';
import { About } from '../Apps/About/About';

const ComponentObj = {
    Routing: Routing,
    Layout: Layout,

    Home: Home,
    About: About,
};

/**
 * Component's getter.
 */
export const Component = new Proxy(ComponentObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in Component.`);
        }

        return Reflect.get(target, key, receiver);
    },
});

/**
 * Component's setter.
 *
 * @param  {string}          name
 * @param  {function|object} component
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setComponent(name, component) {
    checkString(name);
    checkComponent(component);

    ComponentObj[name] = component;
}
