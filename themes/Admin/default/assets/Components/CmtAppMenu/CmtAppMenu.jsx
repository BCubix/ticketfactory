import React, { useMemo } from 'react';
import { Component } from '@/AdminService/Component';
import { Tab } from '@/AdminService/Tab';

export const CmtAppMenu = ({ tabList = null, tabListName = '', tabValue = null, path = '' }) => {
    const list = useMemo(() => {
        if (tabList) {
            return tabList;
        }

        if (tabListName) {
            return Tab[tabListName];
        }

        return [];
    }, [tabList, tabListName]);

    const listIndex = useMemo(() => {
        if (tabValue) {
            return tabValue;
        }

        const index = list.findIndex((it) => it.path === path);
        if (index >= 0) {
            return index;
        }

        return 0;
    }, [list]);

    return <Component.CmtTabs tabValue={listIndex} list={list} />;
};
