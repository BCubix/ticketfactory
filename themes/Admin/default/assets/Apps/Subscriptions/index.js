import React from 'react';

import subscriptionsApi from './services/api/subscriptionsApi';
import subscriptionsReducer from './redux/subscriptions/subscriptionsSlice';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';
import { SubscriptionsList, subscriptionsListCrud } from './SubscriptionsList/SubscriptionsList';
import { CreateSubscription, subscriptionsCreateCrud } from './CreateSubscription/CreateSubscription';
import { EditSubscription, subscriptionsEditCrud } from './EditSubscription/EditSubscription';

const ROLE_READ = 'ROLE_SUBSCRIPTION_READ';
const ROLE_CREATE = 'ROLE_SUBSCRIPTION_CREATE';
const ROLE_EDIT = 'ROLE_SUBSCRIPTION_EDIT';

export const initConstant = () => {
    setConstant('SUBSCRIPTIONS_BASE_PATH', '/admin/abonnements');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('SubscriptionsList', SubscriptionsList);
    setComponent('CreateSubscription', CreateSubscription);
    setComponent('EditSubscription', EditSubscription);
};

export const initApi = () => {
    setApi('subscriptionsApi', subscriptionsApi);
};

export const initReducer = () => {
    setReducer('subscriptions', subscriptionsReducer);
};

export default function ({ parameters, userRoles }) {
    // Check if the user have the Read role and if subscriptions is used
    const useSubscriptions = parameters?.find((el) => el.paramKey === 'core_use_subscriptions');
    if (!checkUserAccess(userRoles, ROLE_READ) || !useSubscriptions?.paramValue) {
        return;
    }

    // Add Tab to vouchers menu
    addTabElements('vouchersTabList', [{ label: 'Abonnements', component: <Component.SubscriptionsList />, path: Constant.SUBSCRIPTIONS_BASE_PATH }], 2);

    // Add List Route
    setAuthenticatedRoute(Constant.SUBSCRIPTIONS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'vouchersTabList',
        tabPathValue: Constant.SUBSCRIPTIONS_BASE_PATH,
    });

    // Add Create Route
    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.SUBSCRIPTIONS_BASE_PATH + Constant.CREATE_PATH, Component.CreateSubscription);
    }

    // Add Edit Route
    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.SUBSCRIPTIONS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditSubscription);
    }

    //Add Crud
    const crud = {
        list: subscriptionsListCrud,
        add: subscriptionsCreateCrud,
        edit: subscriptionsEditCrud,
    };

    setCrud('subscriptions', crud);
}
