import React from 'react';

import { changeOrderStatusFilters, getOrderStatusAction, orderStatusSelector } from '@Apps/OrderStatus/redux/orderStatus/orderStatusSlice';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { Api } from '@/AdminService/Api';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const orderStatusListCrud = {
    title: 'Étapes de commandes',
    listTitle: 'Liste des étapes de commandes',
    filtersData: [
        'name',
        'page',
        'lang',
        'limit',
        {
            key: 'sort',
            transformFilter: (params, sort) => {
                const splitSort = sort?.split(' ');

                params['filters[sortField]'] = splitSort[0];
                params['filters[sortOrder]'] = splitSort[1];
            },
        },
    ],
    filterList: [{ key: 'name', title: 'Chercher par nom', label: 'Nom', type: 'search' }],
    pagination: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '70%', sortable: true },
    ],
    loadDataAction: () => getOrderStatusAction(),
    changeFiltersActions: (props, page) => changeOrderStatusFilters(props, page),
    dataSelector: orderStatusSelector,
    dataList: (selector) => selector.orderStatus,
    duplicate: (props) => Api.orderStatusApi.duplicateOrderStatus(props),
    checkUserAccess: {
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_ORDER_STATUS_EDIT'),
    },
    links: {
        edit: (id) => `${Constant.ORDER_STATUS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const OrderStatusList = () => {
    return <Component.CmtCrudList listCrud={Crud?.orderStatus?.list} />;
};
