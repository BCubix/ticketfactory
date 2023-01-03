import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getPageBlocksAction } from '@Redux/pageBlocks/pageBlocksSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

import { GetPageBlockColumn } from './CreatePageBlockFormat';
export const CreatePageBlock = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [dialog, setDialog] = useState(true);
    const [submitModel, setSubmitModel] = useState(false);

    const [name, setName] = useState('');
    const [formatIndex, setFormatIndex] = useState(0);
    const [model, setModel] = useState({
        name: '',
        saveAsModel: true,
        columns: [],
    });

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlocksApi.createPageBlock(values);

            if (result?.result) {
                NotificationManager.success('Le block de page a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);

                dispatch(getPageBlocksAction());
                navigate(Constant.PAGE_BLOCKS_BASE_PATH);
            }
        });
    };

    const handleCreate = () => {
        const columns = [];
        Constant.PAGE_BLOCKS_FORMATS[formatIndex].forEach((value) => {
            columns.push(GetPageBlockColumn(value));
        });

        model.name = name;
        model.columns = columns;

        setModel(model);
        setSubmitModel(true);
        setDialog(false);
    };

    return (
        <>
            {submitModel && <Component.PageBlocksForm handleSubmit={handleSubmit} modelValues={model} />}
            <Dialog
                open={dialog}
                maxWidth="md"
                fullWidth
                onClose={() => {
                    setDialog(false);
                    if (!submitModel) {
                        navigate(Constant.PAGE_BLOCKS_BASE_PATH);
                    }
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                    <Typography component="h3" variant="h3" fontSize={20}>
                        Créer un nouveau bloc
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ minHeight: 250 }}>
                    <Component.CreatePageBlockFormat name={name} setName={setName} formatIndex={formatIndex} setFormatIndex={setFormatIndex} />
                </DialogContent>
                <DialogActions>
                    <Button id="createBlockSubmit" onClick={handleCreate}>
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
