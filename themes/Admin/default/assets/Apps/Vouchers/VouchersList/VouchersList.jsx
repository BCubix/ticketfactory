import React from 'react';

import { Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeVouchersFilters, getVouchersAction, vouchersSelector } from '@Apps/Vouchers/redux/vouchers/vouchersSlice';
import moment from 'moment';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const vouchersListCrud = {
    title: 'Réductions',
    listTitle: 'Liste des réductions',
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
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '15%' },
        { name: 'code', label: 'Code', width: '10%' },
        {
            name: 'discount',
            label: 'Réduction',
            width: '10%',
            renderFunction: (item) => (
                <Typography>
                    {item?.discount} {item.unit}
                </Typography>
            ),
        },
        {
            name: 'beginDate',
            label: 'Date de début',
            width: '15%',
            renderFunction: (item) => <Typography>{item.beginDate ? moment(item.beginDate).format('DD/MM/YYYY') : '-'}</Typography>,
        },
        {
            name: 'endDate',
            label: 'Date de fin',
            width: '15%',
            renderFunction: (item) => <Typography>{item.endDate ? moment(item.endDate).format('DD/MM/YYYY') : '-'}</Typography>,
        },
    ],
    loadDataAction: () => getVouchersAction(),
    changeFiltersActions: (props, page) => changeVouchersFilters(props, page),
    dataSelector: vouchersSelector,
    dataList: (selector) => selector.vouchers,
    delete: (props) => Api.vouchersApi.deleteVoucher(props),
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_VOUCHER_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_VOUCHER_EDIT'),
        delete: (userRoles) => checkUserAccess(userRoles, 'ROLE_VOUCHER_DELETE'),
    },
    links: {
        new: () => `${Constant.VOUCHERS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.VOUCHERS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette réduction ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const VouchersList = () => {
    return <Component.CmtCrudList listCrud={Crud?.vouchers?.list} />;
};
