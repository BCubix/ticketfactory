import React from 'react';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

import { VouchersList, vouchersListCrud } from '@Apps/Vouchers/VouchersList/VouchersList';
import { CreateVoucher } from '@Apps/Vouchers/CreateVoucher/CreateVoucher';
import { EditVoucher } from '@Apps/Vouchers/EditVoucher/EditVoucher';
import vouchersReducer from '@Apps/Vouchers/redux/vouchers/vouchersSlice';
import vouchersApi from '@Apps/Vouchers/services/api/vouchersApi';
import { vouchersCreateCrud } from './CreateVoucher/CreateVoucher';
import { vouchersEditCrud } from './EditVoucher/EditVoucher';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('VOUCHERS_BASE_PATH', '/admin/reductions');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_VOUCHER_READ')) {
        return;
    }

    setComponent('VouchersList', VouchersList);
    setComponent('CreateVoucher', CreateVoucher);
    setComponent('EditVoucher', EditVoucher);
};

export const initApi = () => {
    setApi('vouchersApi', vouchersApi);
};

export const initReducer = () => {
    setReducer('vouchers', vouchersReducer);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_VOUCHER_READ')) {
        return;
    }

    const crud = {
        list: vouchersListCrud,
        add: vouchersCreateCrud,
        edit: vouchersEditCrud,
    };

    setCrud('vouchers', crud);
};

export default async function ({ parameters, userRoles }) {
    if (!checkUserAccess(userRoles, 'ROLE_VOUCHER_READ')) {
        return;
    }

    const useProducts = parameters?.find((el) => el.paramKey === 'core_use_purchase');
    if (useProducts?.paramValue) {
        addTabElements('vouchersTabList', [{ label: 'Réductions', component: <Component.VouchersList />, path: Constant.VOUCHERS_BASE_PATH }]);

        setAuthenticatedRoute(Constant.VOUCHERS_BASE_PATH, Component.CmtAppMenu, {
            tabListName: 'vouchersTabList',
            tabPathValue: Constant.VOUCHERS_BASE_PATH,
        });
        setAuthenticatedRoute(Constant.VOUCHERS_BASE_PATH + Constant.CREATE_PATH, Component.CreateVoucher);
        setAuthenticatedRoute(`${Constant.VOUCHERS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditVoucher);

        insertSubMenu(4, 'VENDRE', 'Réductions', Constant.VOUCHERS_BASE_PATH, <MoneyOffIcon />);
    }
}
