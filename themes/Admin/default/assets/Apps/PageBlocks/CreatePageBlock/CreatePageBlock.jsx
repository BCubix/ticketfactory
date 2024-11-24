import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getPageBlocksAction } from '@Apps/PageBlocks/redux/pageBlocks/pageBlocksSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

import { GetPageBlockColumn } from './CreatePageBlockFormat';
import { pageBlocksInitialSchema, pageBlocksValidationSchema, pageBlocksForm } from '../PageBlocksForm/PageBlocksForm';
import { Crud } from '@/AdminService/Crud';

export const pageBlocksCreateCrud = {
    form: {
        title: "Creation d'un bloc de page",
        initialSchema: pageBlocksInitialSchema,
        validationSchema: pageBlocksValidationSchema,
    },
    ...pageBlocksForm,
};

const NEW_BLOCK_DATA = {
    name: '',
    saveAsModel: true,
    formatIndex: 0,
    pageBlock: null,
    selectedBlock: 0,
    pageBlockType: '',
};

export const CreatePageBlock = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);
    const [newBlockData, setNewBlockData] = useState(NEW_BLOCK_DATA);
    const [pageBlockTypesList, setPageBlockTypesList] = useState(null);

    const [queryParameters] = useSearchParams();
    const pageBlockId = queryParameters.get('pageBlockId');
    const languageId = queryParameters.get('languageId');

    const [dialog, setDialog] = useState(pageBlockId && languageId ? false : true);
    const [submitModel, setSubmitModel] = useState(pageBlockId && languageId ? true : false);

    const getPageBlockTypesList = async () => {
        const result = await Api.pageBlockTypesApi.getAllPageBlockTypes();
        if (!result?.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        setPageBlockTypesList(result.pageBlockTypes);
    };

    useEffect(() => {
        apiMiddleware(dispatch, () => {
            getPageBlockTypesList();
        });
    }, []);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            if (!pageBlockId || !languageId) {
                return;
            }

            let pageBlock = await Api.pageBlocksApi.getTranslated(pageBlockId, languageId);
            if (!pageBlock?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGE_BLOCKS_BASE_PATH);
                return;
            }

            setInitialValues(pageBlock.pageBlock);
        });
    }, []);

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
        let formCrud = Crud.pageBlocks.add;

        const columns = [];
        if (!newBlockData.pageBlockType) {
            Constant.PAGE_BLOCKS_FORMATS[newBlockData.formatIndex].forEach((value) => {
                columns.push(GetPageBlockColumn(value));
            });
        }

        let fields = {};
        if (newBlockData.pageBlockType) {
            pageBlockTypesList
                ?.find((item) => item.id === newBlockData.pageBlockType)
                .fields.forEach((el) => {
                    if (formCrud.contentFields[el.type]?.getInitialValue) {
                        fields[el.name] = formCrud.contentFields[el.type]?.getInitialValue(el, formCrud.contentFields) || '';
                    } else {
                        fields[el.name] = '';
                    }
                });
        }

        setNewBlockData({ ...newBlockData, columns, fields });
        setSubmitModel(true);
        setDialog(false);
    };

    if (pageBlockId && !initialValues) {
        return <></>;
    }

    return (
        <>
            {submitModel && (
                <Component.PageBlocksForm
                    pageBlockTypesList={pageBlockTypesList}
                    handleSubmit={handleSubmit}
                    modelValues={newBlockData}
                    translateInitialValues={initialValues}
                    formCrud={Crud?.pageBlocks?.add}
                />
            )}

            <Dialog
                open={dialog}
                maxWidth="lg"
                fullWidth
                onClose={() => {
                    setDialog(false);
                    if (!submitModel) {
                        navigate(Constant.PAGE_BLOCKS_BASE_PATH);
                    }
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }} component="h3" variant="h3" fontSize={20}>
                    Créer un nouveau bloc
                </DialogTitle>

                <DialogContent sx={{ minHeight: 350 }}>
                    <Component.CreatePageBlockFormat newBlockData={newBlockData} setNewBlockData={setNewBlockData} pageBlockTypesList={pageBlockTypesList || []} />
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
