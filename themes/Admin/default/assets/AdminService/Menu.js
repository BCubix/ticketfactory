import React from 'react';

import { checkArray, checkObject, checkPosition, checkString } from '@Services/utils/check';

const MenuObj = [
    () => ({
        title: 'PROGRAMMATION',
        menu: [],
    }),
    () => ({
        title: 'VENDRE',
        menu: [],
    }),
    () => ({
        title: 'PERSONNALISER',
        menu: [],
    }),
    () => ({
        title: 'ADMINISTRER',
        menu: [],
    }),
    () => ({
        title: 'PARAMETRER',
        menu: [],
    }),
];

/**
 * Menu's getter.
 */
export const Menu = new Proxy(MenuObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in Menu.`);
        }

        const result = Reflect.get(target, key, receiver);
        return typeof result === 'function' && result.name === '' ? result() : result;
    },
});

/**
 * Menu's setter
 *
 * @param  {number}  position Position in menu (must be > 1)
 * @param  {string}  title    Title of the menu
 * @param  {Array}   menu     Menu
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setMenu(position, title, menu = []) {
    checkPosition(position);
    checkString(title);
    checkArray(menu);

    MenuObj[position - 1] = () => ({
        title: title,
        menu: menu,
    });
}

export function getMenu(title) {
    checkString(title);

    return MenuObj?.find((item) => item?.title === title);
}

export function getSubMenu(title, name = null) {
    checkString(title);
    if (name !== null) {
        checkString(name);
    }

    const index = MenuObj.findIndex((item) => item().title === title);
    if (index === -1) {
        throw new Error(`The title '${title}' must be in Menu.`);
    }

    const menu = MenuObj[index]();
    if (!name) {
        return menu;
    }

    return menu.menu?.find((item) => item?.name === name);
}

/**
 * Menu's insert.
 *
 * @param  {number}  position Position in menu (must be > 1)
 * @param  {string}  title    Title of the menu
 * @param  {Array}   menu     Menu
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function insertMenu(position, title, menu = []) {
    checkPosition(position);
    checkString(title);
    checkArray(menu);

    for (const tab of menu) {
        checkObject(tab);

        if (Object.keys(tab).length !== 3) {
            throw new Error(`The length of ${tab}'s keys must be 3.`);
        }

        const { name, link, icon } = tab;
        checkString(name);
        checkString(link);
        checkObject(icon);
    }

    MenuObj.splice(position - 1, 0, () => ({
        title: title,
        menu: menu,
    }));
}

/**
 * SubMenu's setter
 *
 * @param  {number}  position Position in menu (must be > 1)
 * @param  {string}  title    Title of a menu
 * @param  {string}  name     Name of submenu
 * @param  {string}  link     Link of submenu
 * @param  {object}  icon     Icon of submenu
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setSubMenu(position, title, name, link, icon, options = {}) {
    checkPosition(position);
    checkString(title);
    checkString(name);
    checkObject(icon);

    if (null !== link) {
        checkString(link);
    }

    const index = MenuObj.findIndex((menu) => menu().title === title);
    if (index === -1) {
        throw new Error(`The title '${title}' must be in Menu.`);
    }

    const menu = MenuObj[index]();

    const subMenuIndex = menu.menu.findIndex((it) => it.name === name);
    if (subMenuIndex === -1) {
        throw new Error(`The name '${name}' must be in Menu ${title}.`);
    }

    menu.menu[subMenuIndex] = { ...menu.menu[subMenuIndex], name: name, link: link, icon: icon, position, ...options };

    MenuObj[index] = () => ({
        title: menu.title,
        menu: menu.menu,
    });
}

/**
 * SubMenu's insert
 *
 * @param  {number}  position Position in menu (must be > 1)
 * @param  {string}  title    Title of a menu
 * @param  {string}  name     Name of submenu
 * @param  {string}  link     Link of submenu
 * @param  {object}  icon     Icon of submenu
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function insertSubMenu(position, title, name, link, icon, options = {}) {
    checkPosition(position);
    checkString(title);
    checkString(name);
    checkObject(icon);

    if (null !== link) {
        checkString(link);
    }

    const index = MenuObj.findIndex((menu) => menu().title === title);
    if (index === -1) {
        throw new Error(`The title '${title}' must be in Menu.`);
    }

    const menu = MenuObj[index]();

    menu.menu.splice(position - 1, 0, { name: name, link: link, icon: icon, position, ...options });

    MenuObj[index] = () => ({
        title: menu.title,
        menu: menu.menu,
    });
}

export function addRelatedLink(title, name, relatedLink) {
    const index = MenuObj.findIndex((menu) => menu().title === title);
    if (index === -1) {
        throw new Error(`The title '${title}' must be in Menu.`);
    }

    let menu = MenuObj[index]();

    const subMenuIndex = menu.menu.findIndex((it) => it.name === name);
    if (subMenuIndex === -1) {
        throw new Error(`The name '${name}' must be in Menu ${title}.`);
    }

    if (!menu.menu[subMenuIndex].relatedLinks) {
        menu.menu[subMenuIndex].relatedLinks = [];
    }

    menu.menu[subMenuIndex].relatedLinks.push(relatedLink);

    setMenu(index + 1, menu.title, menu.menu);
}
