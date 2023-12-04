import React from 'react';

import { CustomersList, customersListCrud } from '@Apps/Customers/CustomersList/CustomersList';
import { CreateCustomer, customersCreateCrud } from '@Apps/Customers/CreateCustomer/CreateCustomer';
import { EditCustomer, customersEditCrud } from '@Apps/Customers/EditCustomer/EditCustomer';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';

import customersReducer from '@Apps/Customers/redux/customers/customersSlice';
import customersApi from './services/api/customersApi';

import PeopleIcon from '@mui/icons-material/People';

export const initConstant = () => {
    setConstant('CUSTOMERS_BASE_PATH', '/admin/clients');
};

export const initComponent = () => {
    setComponent('CustomersList', CustomersList);
    setComponent('CreateCustomer', CreateCustomer);
    setComponent('EditCustomer', EditCustomer);
};

export const initApi = () => {
    setApi('customersApi', customersApi);
};

export const initMenu = () => {};

export const initReducer = () => {
    setReducer('customers', customersReducer);
};

export const initCrud = () => {
    const crud = {
        list: customersListCrud,
        add: customersCreateCrud,
        edit: customersEditCrud,
    };

    setCrud('customers', crud);
};

export default async function ({ parameters }) {
    const useProducts = parameters?.find((el) => el.paramKey === 'core_use_customers');

    if (useProducts?.paramValue) {
        setAuthenticatedRoute(Constant.CUSTOMERS_BASE_PATH, Component.CustomersList);
        setAuthenticatedRoute(Constant.CUSTOMERS_BASE_PATH + Constant.CREATE_PATH, Component.CreateCustomer);
        setAuthenticatedRoute(`${Constant.CUSTOMERS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditCustomer);

        insertSubMenu(1, 'VENDRE', 'Clients', Constant.CUSTOMERS_BASE_PATH, <PeopleIcon />);
    }
}
