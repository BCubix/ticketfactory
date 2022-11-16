import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Button,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { TableColumn } from "@/AdminService/TableColumn";

import { changeContentsFilters, contentsSelector, getContentsAction } from '@Redux/contents/contentsSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const ContentsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, contents, filters, total, error } = useSelector(contentsSelector);
    const [contentTypes, setContentTypes] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [createDialog, setCreateDialog] = useState(false);
    const [formContentType, setFormContentType] = useState('');

    useEffect(() => {
        if (!loading && !contents && !error) {
            dispatch(getContentsAction());
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.getAllContentTypes();

            if (result?.result) {
                setContentTypes(result?.contentTypes);
            }
        });
    }, []);

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.contentsApi.deleteContent(id);

        dispatch(getContentsAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentsApi.duplicateContent(id);

            if (result?.result) {
                NotificationManager.success(
                    'Le contenu a bien été dupliqué.',
                    'Succès',
                    Constant.REDIRECTION_TIME
                );

                dispatch(getContentsAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title="Contenus">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des contenus{' '}
                                {contents &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + contents.length
                                    } sur ${total})`}
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.ContentsFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeContentsFilters(values))}
                            list={contentTypes}
                        />

                        <Component.ListTable
                            filters={filters}
                            contextualMenu
                            table={TableColumn.ContentsList}
                            list={contents}
                            onEdit={(id) => {
                                navigate(`${Constant.CONTENT_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            changeFilters={(newFilters) =>
                                dispatch(changeContentsFilters(newFilters))
                            }
                            onDelete={(id) => setDeleteDialog(id)}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeContentsFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changeContentsFilters({ ...filters, limit: newValue }));
                            }}
                            length={contents?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>

            <Dialog
                open={createDialog}
                onClose={() => setCreateDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ fontSize: 20 }}>Créer un contenu</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ marginTop: 3 }}>
                        <InputLabel id={`contentType-label`} size="small">
                            Type de contenus
                        </InputLabel>
                        <Select
                            labelId={`contentType-label`}
                            variant="standard"
                            size="small"
                            id={`contentType`}
                            value={formContentType}
                            onChange={(e) => {
                                setFormContentType(e.target.value);
                            }}
                            label="Type de contenus"
                        >
                            {contentTypes?.contentTypes?.map((typeList, typeIndex) => (
                                <MenuItem key={typeIndex} value={typeList?.id}>
                                    {typeList?.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Button
                            color="error"
                            onClick={() => {
                                setCreateDialog(false);
                                setFormContentType('');
                            }}
                            id="cancelDialog"
                        >
                            Annuler
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                if (formContentType !== '') {
                                    navigate(
                                        `${Constant.CONTENT_BASE_PATH}${Constant.CREATE_PATH}?contentType=${formContentType}`
                                    );
                                } else {
                                    NotificationManager.error(
                                        'Vous devez renseigner le type de contenu.',
                                        'Erreur',
                                        Constant.REDIRECTION_TIME
                                    );
                                }
                            }}
                            id="validateDialog"
                        >
                            Suivant
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Component.DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">
                        Êtes-vous sûr de vouloir supprimer ce type de contenus ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
