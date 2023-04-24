import React from 'react';
import { checkFunction, checkString } from '@Services/utils/check';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

const keys = ['label', 'component', 'path', 'id'];

const TabObj = {
    CategoriesTabList: () => [
        { label: 'Catégories', component: <Component.CategoriesList />, path: Constant.CATEGORIES_BASE_PATH },
        { label: 'Tags', component: <Component.TagsList />, path: Constant.TAGS_BASE_PATH },
    ],
    ContentTypesTabList: () => [
        { label: 'Types de contenus', component: <Component.ContentTypesList />, path: Constant.CONTENT_TYPES_BASE_PATH },
        { label: 'Types de pages', component: <Component.PageTypesList />, path: Constant.PAGE_TYPES_BASE_PATH },
    ],
    MediasTabList: () => [
        { label: 'Médias', component: <Component.MediasList />, path: Constant.MEDIAS_BASE_PATH },
        { label: 'Catégories de média', component: <Component.MediaCategoriesList />, path: Constant.MEDIA_CATEGORIES_BASE_PATH },
        {
            label: "Formats d'images",
            component: <Component.ImageFormatsList />,
            path: Constant.IMAGE_FORMATS_BASE_PATH,
        },
    ],
    PagesTabList: () => [
        { label: 'Pages', component: <Component.PagesList />, path: Constant.PAGES_BASE_PATH },
        { label: 'Blocs', component: <Component.PageBlocksList />, path: Constant.PAGE_BLOCKS_BASE_PATH },
    ],
    ModulesTabList: () => [
        { label: 'Modules', component: <Component.ModulesList />, path: Constant.MODULES_BASE_PATH },
        { label: 'Hooks', component: <Component.HooksList />, path: Constant.HOOKS_BASE_PATH },
    ],
    EventsFormTabList: (props) => [
        {
            label: 'Evènement',
            id: 'eventPartButton',
            component: <Component.EventMainPartForm {...props} />,
        },
        {
            label: 'Dates',
            id: 'datesPartButton',
            component: <Component.EventsDateBlockForm {...props} />,
        },
        {
            label: 'Tarifs',
            id: 'pricesPartButton',
            component: <Component.EventsPriceBlockForm {...props} />,
        },
        {
            label: 'Médias',
            id: 'mediasPartButton',
            component: <Component.EventMediaPartForm {...props} />,
        },
    ],
};

/**
 * Tab's getter.
 */
export const Tab = new Proxy(TabObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in Tab.`);
        }

        const result = Reflect.get(target, key, receiver);
        return typeof result === 'function' && result.length === 0 ? result() : result;
    },
});

/**
 * Tab's setter.
 *
 * @param  {string}   name
 * @param  {function} tabListFunction
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setTab(name, tabListFunction) {
    checkString(name);
    checkFunction(tabListFunction);

    TabObj[name] = tabListFunction;
}
