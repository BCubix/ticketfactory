import { checkString } from '../services/utils/check';

const ConstantObj = {
    IMAGES_FILE_PATH: '/images',
    ICONS_FILE_PATH: '/images/icons',
    LOGOS_FILE_PATH: '/images/logos',

    DEFAULT_LOGOS_FILE: '/TicketFactoryRougeHori.svg',

    HOME_PATH: '/',
    ABOUT_PATH: '/about',
};

/**
 * Constant's getter.
 */
export const Constant = new Proxy(ConstantObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in Constant.`);
        }

        const result = Reflect.get(target, key, receiver);
        return typeof result === 'function' && result.name === '' ? result() : result;
    },
});

/**
 * Constant's setter.
 *
 * @param  {string} name
 * @param  {*}      constant
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setConstant(name, constant) {
    checkString(name);

    ConstantObj[name] = constant;
}
