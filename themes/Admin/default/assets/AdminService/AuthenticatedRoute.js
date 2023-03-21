import React from 'react';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { checkComponent, checkObject, checkString } from '@Services/utils/check';
import { Navigate } from 'react-router-dom';

const AuthenticatedRouteObj = [
    () => ({ path: Constant.HOME_PATH, component: () => <Navigate to={Constant.EVENTS_BASE_PATH} />, exact: true }),

    () => ({ path: Constant.USER_BASE_PATH, component: Component.UserList }),
    () => ({ path: Constant.USER_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateUser }),
    () => ({ path: `${Constant.USER_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditUser }),

    () => ({ path: `${Constant.PROFILE_BASE_PATH}${Constant.EDIT_PATH}`, component: Component.EditProfile }),

    () => ({ path: Constant.EVENTS_BASE_PATH, component: Component.EventsList }),
    () => ({ path: Constant.EVENTS_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateEvent }),
    () => ({ path: `${Constant.EVENTS_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditEvent }),

    () => ({ path: Constant.CATEGORIES_BASE_PATH, component: Component.CategoriesMenu, tabValue: 0 }),
    () => ({ path: `${Constant.CATEGORIES_BASE_PATH}/:id`, component: Component.CategoriesMenu, tabValue: 0 }),
    () => ({ path: Constant.CATEGORIES_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateCategory }),
    () => ({ path: `${Constant.CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditCategory }),

    () => ({ path: Constant.TAGS_BASE_PATH, component: Component.CategoriesMenu, tabValue: 1 }),
    () => ({ path: Constant.TAGS_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateTag }),
    () => ({ path: `${Constant.TAGS_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditTag }),

    () => ({ path: Constant.ROOMS_BASE_PATH, component: Component.RoomsList }),
    () => ({ path: Constant.ROOMS_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateRoom }),
    () => ({ path: `${Constant.ROOMS_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditRoom }),

    () => ({ path: Constant.SEASONS_BASE_PATH, component: Component.SeasonsList }),
    () => ({ path: Constant.SEASONS_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateSeason }),
    () => ({ path: `${Constant.SEASONS_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditSeason }),

    () => ({ path: Constant.LOGS_BASE_PATH, component: Component.LogsList }),

    () => ({ path: Constant.MEDIAS_BASE_PATH, component: Component.MediasMenu, tabValue: 0 }),

    () => ({ path: Constant.MEDIA_CATEGORIES_BASE_PATH, component: Component.MediasMenu, tabValue: 1 }),
    () => ({ path: `${Constant.MEDIA_CATEGORIES_BASE_PATH}/:id`, component: Component.MediasMenu, tabValue: 1 }),
    () => ({ path: Constant.MEDIA_CATEGORIES_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateMediaCategory }),
    () => ({ path: `${Constant.MEDIA_CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditMediaCategory }),

    () => ({ path: Constant.IMAGE_FORMATS_BASE_PATH, component: Component.MediasMenu, tabValue: 2 }),
    () => ({ path: Constant.IMAGE_FORMATS_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateImageFormat }),
    () => ({
        path: `${Constant.IMAGE_FORMATS_BASE_PATH}/:id${Constant.EDIT_PATH}`,
        component: Component.EditImageFormat,
    }),

    () => ({ path: Constant.CONTENT_TYPES_BASE_PATH, component: Component.ContentTypesList }),
    () => ({ path: Constant.CONTENT_TYPES_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateContentType }),
    () => ({
        path: `${Constant.CONTENT_TYPES_BASE_PATH}/:id${Constant.EDIT_PATH}`,
        component: Component.EditContentType,
    }),

    () => ({ path: Constant.CONTENT_BASE_PATH, component: Component.ContentsList }),
    () => ({ path: Constant.CONTENT_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateContent }),
    () => ({ path: `${Constant.CONTENT_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditContent }),

    () => ({ path: Constant.CONTACT_REQUEST_BASE_PATH, component: Component.ContactRequestsList }),
    () => ({
        path: Constant.CONTACT_REQUEST_BASE_PATH + Constant.CREATE_PATH,
        component: Component.CreateContactRequests,
    }),
    () => ({
        path: `${Constant.CONTACT_REQUEST_BASE_PATH}/:id${Constant.EDIT_PATH}`,
        component: Component.EditContactRequest,
    }),

    () => ({ path: Constant.REDIRECTIONS_BASE_PATH, component: Component.RedirectionsList }),
    () => ({ path: Constant.REDIRECTIONS_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateRedirection }),
    () => ({
        path: `${Constant.REDIRECTIONS_BASE_PATH}/:id${Constant.EDIT_PATH}`,
        component: Component.EditRedirection,
    }),

    () => ({ path: Constant.MENUS_BASE_PATH, component: Component.MenusList }),
    () => ({ path: Constant.MENUS_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateMenu }),

    () => ({ path: Constant.PAGES_BASE_PATH, component: Component.PagesMenu, tabValue: 0 }),
    () => ({ path: Constant.PAGES_BASE_PATH + Constant.CREATE_PATH, component: Component.CreatePage }),
    () => ({ path: `${Constant.PAGES_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditPage }),

    () => ({ path: Constant.PAGE_BLOCKS_BASE_PATH, component: Component.PagesMenu, tabValue: 1 }),
    () => ({ path: Constant.PAGE_BLOCKS_BASE_PATH + Constant.CREATE_PATH, component: Component.CreatePageBlock }),
    () => ({ path: `${Constant.PAGE_BLOCKS_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditPageBlock }),

    () => ({ path: `${Constant.PAGE_HISTORY_BASE_PATH}/:id`, component: Component.PageHistory }),

    () => ({ path: Constant.PARAMETERS_BASE_PATH, component: Component.ParametersMenu }),

    () => ({ path: Constant.LANGUAGES_BASE_PATH, component: Component.LanguagesList }),
    () => ({ path: Constant.LANGUAGES_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateLanguage }),
    () => ({ path: `${Constant.LANGUAGES_BASE_PATH}/:id${Constant.EDIT_PATH}`, component: Component.EditLanguage }),

    () => ({ path: Constant.THEMES_BASE_PATH, component: Component.ThemesList }),

    () => ({ path: Constant.MODULES_BASE_PATH, component: Component.ModulesMenu, tabValue: 0 }),

    () => ({ path: Constant.HOOKS_BASE_PATH, component: Component.ModulesMenu, tabValue: 1 }),
    () => ({ path: Constant.HOOKS_BASE_PATH + Constant.CREATE_PATH, component: Component.CreateHook }),
];

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
