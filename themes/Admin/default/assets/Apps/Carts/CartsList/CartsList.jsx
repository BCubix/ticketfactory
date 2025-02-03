import React from 'react';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { cartsSelector, getCartsAction, changeCartsFilters } from '@Apps/Carts/redux/carts/cartsSlice';

import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { Crud } from '@/AdminService/Crud';
import { Chip, Typography } from '@mui/material';
import moment from 'moment';

export const cartsListCrud = {
    title: 'Paniers',
    listTitle: 'Liste des paniers',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'page',
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
    tableContextualMenu: false,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        {
            name: 'name',
            label: 'Nom',
            width: '30%',
            renderFunction: (item) => {
                if (item.customer) {
                    return (
                        <Typography>
                            {item.customer?.civility} {item.customer?.firstName} {item.customer?.lastName}
                        </Typography>
                    );
                }
                return <Typography>-----------</Typography>;
            },
        },
        {
            name: 'total',
            label: 'Total',
            width: '20%',
            renderFunction: (item) => (
                <Chip
                    sx={{ backgroundColor: '#FFFFFF', color: (theme) => theme.palette.success.main }}
                    label={`${item?.eventRows?.reduce((partialSum, a) => partialSum + a.total, 0)?.toFixed(2)} €`}
                />
            ),
        },
        {
            name: 'createdAt',
            label: 'Date',
            width: '20%',
            renderFunction: (item) => <Typography>{moment(item.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>,
        },
    ],
    loadDataAction: () => getCartsAction(),
    changeFiltersActions: (props, page) => changeCartsFilters(props, page),
    dataSelector: cartsSelector,
    dataList: (selector) => selector.carts,
    links: {
        detail: (id) => `${Constant.CARTS_BASE_PATH}/${id}`,
        preview: (item) => `${Constant.CARTS_BASE_PATH}/${item.id}`,
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const CartsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.carts?.list} />;
};
