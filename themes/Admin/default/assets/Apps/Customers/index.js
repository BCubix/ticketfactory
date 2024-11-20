import React from 'react';
import PeopleIcon from '@mui/icons-material/People';

import { CustomersList, customersListCrud } from '@Apps/Customers/CustomersList/CustomersList';
import { CreateCustomer, customersCreateCrud } from '@Apps/Customers/CreateCustomer/CreateCustomer';
import { EditCustomer, customersEditCrud } from '@Apps/Customers/EditCustomer/EditCustomer';
import customersReducer from '@Apps/Customers/redux/customers/customersSlice';
import customersApi from './services/api/customersApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_CUSTOMER_READ';
const ROLE_CREATE = 'ROLE_CUSTOMER_CREATE';
const ROLE_EDIT = 'ROLE_CUSTOMER_EDIT';

export const initConstant = () => {
    setConstant('CUSTOMERS_BASE_PATH', '/admin/clients');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('CustomersList', CustomersList);
    setComponent('CreateCustomer', CreateCustomer);
    setComponent('EditCustomer', EditCustomer);
};

export const initApi = () => {
    setApi('customersApi', customersApi);
};

export const initReducer = () => {
    setReducer('customers', customersReducer);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: customersListCrud,
        add: customersCreateCrud,
        edit: customersEditCrud,
    };

    setCrud('customers', crud);
};

export default async function ({ parameters, userRoles }) {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const useProducts = parameters?.find((el) => el.paramKey === 'core_use_customers');
    if (!useProducts?.paramValue) {
        return;
    }

    addTabElements('customersTabList', [{ label: 'Clients', component: <Component.CustomersList />, path: Constant.CUSTOMERS_BASE_PATH }]);

    setAuthenticatedRoute(Constant.CUSTOMERS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'customersTabList',
        tabPathValue: Constant.CUSTOMERS_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.CUSTOMERS_BASE_PATH + Constant.CREATE_PATH, Component.CreateCustomer);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.CUSTOMERS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditCustomer);
    }

    insertSubMenu(1, 'VENDRE', 'Clients', Constant.CUSTOMERS_BASE_PATH, <PeopleIcon />);
}
