import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { getVouchersAction } from '@Redux/vouchers/vouchersSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const EditVoucher = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [voucher, setVoucher] = useState(null);

    const getVoucher = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.vouchersApi.getOneVoucher(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.VOUCHERS_BASE_PATH);
                return;
            }

            setVoucher(result.voucher);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.VOUCHERS_BASE_PATH);
            return;
        }

        getVoucher(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.vouchersApi.editVoucher(id, values);
            if (result.result) {
                NotificationManager.success('La réduction a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getVouchersAction());
                navigate(Constant.VOUCHERS_BASE_PATH);
            }
        });
    };

    if (!voucher) {
        return <></>;
    }

    return <Component.VouchersForm handleSubmit={handleSubmit} initialValues={voucher} />;
};
