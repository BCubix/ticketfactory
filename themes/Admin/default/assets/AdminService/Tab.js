import React from 'react';
import { checkFunction, checkString } from '@Services/utils/check';
import { Component } from '@/AdminService/Component';

const keys = ['label', 'component', 'path', 'id'];

const TabObj = {
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
            component: <Component.EventsPriceCategoryForm {...props} />,
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

export function addTabElements(name, tabList, startPosition = 0) {
    /* We use try, catch and finally to handle error when key doesn't exist in Tab */

    let newTabList = null;
    try {
        newTabList = Tab[name];
    } catch {
        newTabList = [];
    } finally {
        tabList.forEach((item, index) => {
            let position = item?.position || startPosition + index;

            newTabList.splice(position - 1, 0, { ...item, position: position });
        });

        setTab(name, () => [...newTabList]);
    }
}
