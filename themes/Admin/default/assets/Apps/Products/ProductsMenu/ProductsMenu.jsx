import React from 'react';
import { Component } from '@/AdminService/Component';
import { Tab } from '@/AdminService/Tab';

export const ProductsMenu = ({ tabValue = 0 }) => {
    return <Component.CmtTabs tabValue={tabValue} list={Tab.ProductsTabList} />;
};
