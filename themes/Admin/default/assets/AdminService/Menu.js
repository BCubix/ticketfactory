import React from 'react';

import BusinessIcon from '@mui/icons-material/Business';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import CategoryIcon from '@mui/icons-material/Category';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import MenuIcon from '@mui/icons-material/Menu';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SourceIcon from '@mui/icons-material/Source';
import TvIcon from '@mui/icons-material/Tv';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import WidgetsIcon from '@mui/icons-material/Widgets';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';

import { Constant } from '@/AdminService/Constant';
import { checkArray, checkObject, checkPosition, checkString } from '@Services/utils/check';

const MenuObj = [
    () => ({
        title: 'PROGRAMMATION',
        menu: [
            {
                name: 'Evènements',
                link: Constant.EVENTS_BASE_PATH,
                icon: <ConfirmationNumberIcon />,
            },
            { name: 'Catégories', link: Constant.CATEGORIES_BASE_PATH, relatedLinks: [Constant.TAGS_BASE_PATH], icon: <CategoryIcon /> },
            { name: 'Salles', link: Constant.ROOMS_BASE_PATH, icon: <BusinessIcon /> },
            { name: 'Saisons', link: Constant.SEASONS_BASE_PATH, icon: <CalendarMonthIcon /> },
        ],
    }),
    () => ({
        title: 'PERSONNALISATION',
        menu: [
            { name: 'Menus', link: Constant.MENUS_BASE_PATH, icon: <MenuIcon /> },
            { name: 'Pages', link: Constant.PAGES_BASE_PATH, relatedLinks: [Constant.PAGE_BLOCKS_BASE_PATH], icon: <DescriptionIcon /> },
            { name: 'Contenus', link: Constant.CONTENT_BASE_PATH, icon: <SourceIcon /> },
            {
                name: 'Bibliothèque médias',
                link: Constant.MEDIAS_BASE_PATH,
                relatedLinks: [Constant.MEDIA_CATEGORIES_BASE_PATH, Constant.IMAGE_FORMATS_BASE_PATH],
                icon: <PermMediaIcon />,
            },
            {
                name: 'Redirections',
                link: Constant.REDIRECTIONS_BASE_PATH,
                icon: <CallMissedOutgoingIcon />,
            },
            { name: 'Thèmes', link: Constant.THEMES_BASE_PATH, icon: <TvIcon /> },
            { name: 'Modules', link: Constant.MODULES_BASE_PATH, relatedLinks: [Constant.HOOKS_BASE_PATH], icon: <ViewModuleIcon /> },
        ],
    }),
    () => ({
        title: 'ADMINISTRATION',
        menu: [
            { name: 'Paramètres', link: Constant.PARAMETERS_BASE_PATH, icon: <SettingsIcon /> },
            {
                name: 'Types de contenus',
                link: Constant.CONTENT_TYPES_BASE_PATH,
                icon: <WidgetsIcon />,
            },
            { name: 'Contacts', link: Constant.CONTACT_REQUEST_BASE_PATH, icon: <EmailIcon /> },
            { name: 'Utilisateurs', link: Constant.USER_BASE_PATH, icon: <PersonIcon /> },
            { name: 'Logs', link: Constant.LOGS_BASE_PATH, icon: <HistoryIcon /> },
        ],
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

    MenuObj[position - 1] = () => ({
        title: title,
        menu: menu,
    });
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
export function setSubMenu(position, title, name, link, icon) {
    checkPosition(position);
    checkString(title);
    checkString(name);
    checkString(link);
    checkObject(icon);

    const index = MenuObj.findIndex((menu) => menu().title === title);
    if (index === -1) {
        throw new Error(`The title '${title}' must be in Menu.`);
    }

    const menu = MenuObj[index]();
    if (position > menu.menu.length) {
        throw new Error(`The position ${position} must be less than length of menu`);
    }

    menu.menu[position - 1] = { name: name, link: link, icon: icon };

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
export function insertSubMenu(position, title, name, link, icon) {
    checkPosition(position);
    checkString(title);
    checkString(name);
    checkString(link);
    checkObject(icon);

    const index = MenuObj.findIndex((menu) => menu().title === title);
    if (index === -1) {
        throw new Error(`The title '${title}' must be in Menu.`);
    }

    const menu = MenuObj[index]();
    menu.menu.splice(position - 1, 0, { name: name, link: link, icon: icon });

    MenuObj[index] = () => ({
        title: menu.title,
        menu: menu.menu,
    });
}
