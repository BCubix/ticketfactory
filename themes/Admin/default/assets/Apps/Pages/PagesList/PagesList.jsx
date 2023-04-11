import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/system';
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

import { changePagesFilters } from '@Redux/pages/pagesSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { getPagesAction, pagesSelector } from '@Redux/pages/pagesSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const PagesList = () => {
    const { loading, pages, filters, total, error } = useSelector(pagesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [contentTypes, setContentTypes] = useState([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [formContentType, setFormContentType] = useState(0);
    const [availableCreateContent, setAvailableCreateContent] = useState({
        loading: false,
        loaded: true,
        number: 1,
        createdNumber: 0,
        maxNumber: 0,
    });

    useEffect(() => {
        if (!loading && !pages && !error) {
            dispatch(getPagesAction());
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.getAllContentTypes({ pageType: true });
            if (result?.result) {
                setContentTypes(result?.contentTypes);
            }
        });
    }, []);

    const handleDelete = async (id) => {
        apiMiddleware(dispatch, async () => {
            await Api.pagesApi.deletePage(id);
            dispatch(getPagesAction());
            setDeleteDialog(null);
        });
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pagesApi.duplicatePage(id);
            if (result?.result) {
                NotificationManager.success('La page a bien été dupliquée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPagesAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    const handleGetAvailable = async (id) => {
        apiMiddleware(dispatch, async () => {
            const type = contentTypes.find((el) => el.id === id);

            const result = await Api.contentsApi.getAvailable(id);
            if (!result?.result || !type) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                setAvailableCreateContent({ ...availableCreateContent, loaded: false, loading: false, number: 0, createdNumber: 0, maxNumber: 0 });
                return;
            }

            setAvailableCreateContent({
                ...availableCreateContent,
                loading: false,
                loaded: true,
                number: type.maxObjectNb ? type.maxObjectNb - result.number : 1,
                createdNumber: result.number,
                maxNumber: type.maxObjectNb,
            });
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title={'Pages'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des pages {pages && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + pages.length} sur ${total})`}
                                </Typography>
                                <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.PagesFilters filters={filters} changeFilters={(values) => dispatch(changePagesFilters(values))} />

                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.PagesList}
                            list={pages}
                            onEdit={(id) => {
                                navigate(`${Constant.PAGES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onTranslate={(id, languageId) => {
                                navigate(`${Constant.PAGES_BASE_PATH}${Constant.CREATE_PATH}?pageId=${id}&languageId=${languageId}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changePagesFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changePagesFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changePagesFilters({ ...filters, limit: newValue }));
                            }}
                            length={pages?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>

            <Dialog open={createDialog} onClose={() => setCreateDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontSize: 20 }}>Créer une page</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ marginTop: 3 }}>
                        <InputLabel id={`contentType-label`} size="small">
                            Type de page
                        </InputLabel>
                        <Select
                            labelId={`contentType-label`}
                            variant="standard"
                            size="small"
                            id={`selectContentType`}
                            value={formContentType}
                            onChange={(e) => {
                                if (e.target.value === 0) {
                                    setAvailableCreateContent({ ...availableCreateContent, loading: false, number: 1 });
                                    setFormContentType(e.target.value);
                                    return;
                                }

                                setAvailableCreateContent({ ...availableCreateContent, loading: true });
                                setFormContentType(e.target.value);
                                handleGetAvailable(e.target.value);
                            }}
                            label="Type de contenus"
                        >
                            <MenuItem key={0} value={0} id={`selectContentTypeValue-0`}>
                                Page classique
                            </MenuItem>

                            {contentTypes?.map((typeList, typeIndex) => (
                                <MenuItem key={typeIndex} value={typeList?.id} id={`selectContentTypeValue-${typeList.id}`}>
                                    {typeList?.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {!availableCreateContent.loading && availableCreateContent.loaded && availableCreateContent.number <= 0 && (
                        <Box sx={{ mt: 3, width: '100%', borderRadius: 2, padding: 3, backgroundColor: (theme) => theme.palette.warning.light }}>
                            <Typography sx={{ color: (theme) => theme.palette.warning.main }}>
                                Attention, vous avez {availableCreateContent.createdNumber > availableCreateContent.maxObjectNb ? 'dépassé' : 'atteint'} le nombre de page que vous
                                pouvez créer avec ce type de page. ({availableCreateContent.createdNumber} / {availableCreateContent.maxNumber})
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
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
                                    navigate(`${Constant.PAGES_BASE_PATH}${Constant.CREATE_PATH}?pageType=${formContentType}`);
                                } else {
                                    NotificationManager.error('Vous devez renseigner le type de contenu.', 'Erreur', Constant.REDIRECTION_TIME);
                                }
                            }}
                            id="validateDialog"
                            disabled={availableCreateContent.loading || availableCreateContent.number <= 0}
                        >
                            Suivant
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography>Êtes-vous sûr de vouloir supprimer cette page ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
