import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getPageBlocksAction } from '@Redux/pageBlocks/pageBlocksSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const EditPageBlock = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [pageBlock, setPageBlock] = useState(null);

    const getPageBlock = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlocksApi.getOnePageBlock(id);

            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

                navigate(Constant.PAGE_BLOCKS_BASE_PATH);

                return;
            }

            setPageBlock(result.pageBlock);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.PAGE_BLOCKS_BASE_PATH);
            return;
        }

        getPageBlock(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlocksApi.editPageBlock(id, values);

            if (result.result) {
                NotificationManager.success('Le bloc a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);

                dispatch(getPageBlocksAction());

                navigate(Constant.PAGE_BLOCKS_BASE_PATH);
            }
        });
    };

    if (!pageBlock) {
        return <></>;
    }

    return <Component.PageBlocksForm handleSubmit={handleSubmit} initialValues={pageBlock} />;
};
