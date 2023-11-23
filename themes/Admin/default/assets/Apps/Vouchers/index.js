import React from 'react';

import { VouchersList } from '@Apps/Vouchers/VouchersList/VouchersList';
import { CreateVoucher } from '@Apps/Vouchers/CreateVoucher/CreateVoucher';
import { EditVoucher } from '@Apps/Vouchers/EditVoucher/EditVoucher';
import { VouchersForm } from '@Apps/Vouchers/VouchersForm/VouchersForm';
import { VouchersFilters } from '@Apps/Vouchers/VouchersList/VouchersFilters/VouchersFilters';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import vouchersReducer from '@Apps/Vouchers/redux/vouchers/vouchersSlice';
import vouchersApi from '@Apps/Vouchers/services/api/vouchersApi';

import MoneyOffIcon from '@mui/icons-material/MoneyOff';

export const initConstant = () => {
    setConstant('VOUCHERS_BASE_PATH', '/admin/reductions');
};

export const initComponent = () => {
    setComponent('VouchersList', VouchersList);
    setComponent('CreateVoucher', CreateVoucher);
    setComponent('EditVoucher', EditVoucher);
    setComponent('VouchersForm', VouchersForm);
    setComponent('VouchersFilters', VouchersFilters);
};

export const initApi = () => {
    setApi('vouchersApi', vouchersApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.VOUCHERS_BASE_PATH, Component.VouchersList);
    setAuthenticatedRoute(Constant.VOUCHERS_BASE_PATH + Constant.CREATE_PATH, Component.CreateVoucher);
    setAuthenticatedRoute(`${Constant.VOUCHERS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditVoucher);
};

export const initMenu = () => {
    insertSubMenu(2, 'VENDRE', 'Réductions', Constant.VOUCHERS_BASE_PATH, <MoneyOffIcon />);
};

export const initReducer = () => {
    setReducer('vouchers', vouchersReducer);
};
