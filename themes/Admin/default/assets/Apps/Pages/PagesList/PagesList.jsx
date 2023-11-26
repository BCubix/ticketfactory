import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';

import { Box } from '@mui/system';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

import { changePagesFilters, getPagesAction, pagesSelector } from '@Apps/Pages/redux/pages/pagesSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { useDispatch } from 'react-redux';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const pagesListCrud = {
    title: 'Pages',
    listTitle: 'Liste des pages',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'title',
        'page',
        'lang',
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
    filterList: [
        { key: 'active', title: 'Chercher par status', label: 'Actif', type: 'boolean' },
        { key: 'title', title: 'Chercher par titre', label: 'Titre', type: 'search' },
    ],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'title', label: 'Titre', width: '30%', sortable: true },
        { name: 'slug', label: 'Url', width: '20%' },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getPagesAction(),
    changeFiltersActions: (props, page) => changePagesFilters(props, page),
    dataSelector: pagesSelector,
    dataList: (selector) => selector.pages,
    duplicate: (props) => Api.pagesApi.duplicatePage(props),
    delete: (props) => Api.pagesApi.deletePage(props),
    new: ({ setCreateDialog }) => setCreateDialog(true),
    links: {
        new: () => `${Constant.PAGES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.PAGES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.PAGES_BASE_PATH}${Constant.CREATE_PATH}?pageId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'La page a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette page ?',
    },
    wrapperComponent: DEFAULT_CRUD_LIST_COMPONENTS?.wrapperComponent,
    components: [...DEFAULT_CRUD_LIST_COMPONENTS?.components, { component: (props) => <CreateNewPageDialog {...props} /> }],
};

const CreateNewPageDialog = ({
    createDialog,
    setCreateDialog,
    formContentType,
    setAvailableCreateContent,
    setFormContentType,
    handleGetAvailable,
    contentTypes,
    availableCreateContent,
    navigate,
}) => {
    return (
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
    );
};

export const PagesList = () => {
    const dispatch = useDispatch();
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
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.getAllContentTypes({ pageType: true });
            if (result?.result) {
                setContentTypes(result?.contentTypes);
            }
        });
    }, []);

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
        <Component.CmtCrudList
            listCrud={Crud?.pages?.list}
            createDialog={createDialog}
            setCreateDialog={setCreateDialog}
            formContentType={formContentType}
            setFormContentType={setFormContentType}
            availableCreateContent={availableCreateContent}
            setAvailableCreateContent={setAvailableCreateContent}
            handleGetAvailable={handleGetAvailable}
            contentTypes={contentTypes}
            setContentTypes={setContentTypes}
        />
    );
};
