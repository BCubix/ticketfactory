import React from 'react';
import { Component } from '@/AdminService/Component';
import { Constant } from "@/AdminService/Constant";

export const CategoriesMenu = ({ tabValue = 0 }) => {
    return (
        <Component.CmtTabs
            tabValue={tabValue}
            list={[
                { label: 'Catégories', component: <Component.CategoriesList />, path: Constant.CATEGORIES_BASE_PATH },
                { label: 'Tags', component: <Component.TagsList />, path: Constant.TAGS_BASE_PATH },
            ]}
        />
    );
};
