import { checkFunction, checkString } from '@Services/utils/check';
import React from 'react';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

const keys = ['label', 'component', 'path', 'id'];

const TabObj = {
    CategoriesTabList: () => [
        { label: 'Catégories', component: <Component.CategoriesList />, path: Constant.CATEGORIES_BASE_PATH },
        { label: 'Tags', component: <Component.TagsList />, path: Constant.TAGS_BASE_PATH },
    ],
    MediasTabList: () => [
        { label: 'Médias', component: <Component.MediasList />, path: Constant.MEDIAS_BASE_PATH },
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
    EventsFormTabList: (values, handleChange, handleBlur, touched, errors, setFieldTouched, setFieldValue, roomsList, seasonsList, categoriesList, tagsList, initialValues) => [
        {
            label: 'Evènement',
            id: 'eventPartButton',
            component: (
                <Component.EventMainPartForm
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    errors={errors}
                    setFieldTouched={setFieldTouched}
                    setFieldValue={setFieldValue}
                    roomsList={roomsList}
                    seasonsList={seasonsList}
                    categoriesList={categoriesList}
                    tagsList={tagsList}
                    editMode={Boolean(initialValues)}
                />
            ),
        },
        {
            label: 'Dates',
            id: 'datesPartButton',
            component: (
                <Component.EventsDateBlockForm
                    values={values}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    touched={touched}
                    errors={errors}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    initialValues={initialValues}
                />
            ),
        },
        {
            label: 'Tarifs',
            id: 'pricesPartButton',
            component: (
                <Component.EventsPriceBlockForm
                    values={values}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    touched={touched}
                    errors={errors}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    initialValues={initialValues}
                />
            ),
        },
        {
            label: 'Médias',
            id: 'mediasPartButton',
            component: (
                <Component.EventMediaPartForm
                    values={values}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    touched={touched}
                    errors={errors}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            ),
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
