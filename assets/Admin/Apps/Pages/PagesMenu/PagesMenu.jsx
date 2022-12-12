import React from 'react';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

export const PagesMenu = ({ tabValue = 0 }) => {
    return (
        <Component.CmtTabs
            tabValue={tabValue}
            list={[
                { label: 'Pages', component: <Component.PagesList />, path: Constant.PAGES_BASE_PATH },
                { label: 'Blocs', component: <Component.PageBlocksList />, path: Constant.PAGE_BLOCKS_BASE_PATH },
            ]}
        />
    );
};
