import React from 'react';
import { Chip, Typography } from '@mui/material';

import { ordersSelector, getOrdersAction, changeOrdersFilters } from '@Apps/Orders/redux/orders/ordersSlice';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

export const ordersListCrud = {
    title: 'Commandes',
    listTitle: 'Liste des commandes',
    filtersData: [
        { key: 'active', type: 'boolean' },
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
    filterList: [{ key: 'active', title: 'Chercher par status', label: 'Actif', type: 'boolean' }],
    pagination: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'reference', label: 'Référence', width: '15%', sortable: true },
        {
            name: 'name',
            label: 'Client',
            width: '30%',
            renderFunction: (item) => (
                <Typography>
                    {item.customer?.civility} {item.customer?.firstName} {item.customer?.lastName}
                </Typography>
            ),
        },
        {
            name: 'total',
            label: 'Total',
            width: '20%',
            renderFunction: (item) => (
                <Chip
                    sx={{ backgroundColor: '#FFFFFF', color: (theme) => theme.palette.success.main }}
                    label={`${item?.cart?.cartRows?.reduce((partialSum, a) => partialSum + a.total, 0)?.toFixed(2)} €`}
                />
            ),
        },
        {
            name: 'status',
            label: 'État',
            width: '20%',
            renderFunction: (item) => <Chip sx={{ backgroundColor: item.status.color }} label={item.status.name} />,
        },
    ],
    loadDataAction: () => getOrdersAction(),
    changeFiltersActions: (props) => changeOrdersFilters(props),
    dataSelector: ordersSelector,
    dataList: (selector) => selector.orders,
    links: {
        detail: (id) => `${Constant.ORDERS_BASE_PATH}/${id}`,
        preview: (item) => `${Constant.ORDERS_BASE_PATH}/${item.id}`,
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const OrdersList = () => {
    return <Component.CmtCrudList listCrud={Crud?.orders?.list} />;
};
