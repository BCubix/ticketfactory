import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeContentsFilters, contentsSelector, getContentsAction } from '@Apps/Contents/redux/contents/contentsSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const contentsListCrud = {
    title: 'Contenus',
    listTitle: 'Liste des contenus',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'title',
        {
            key: 'contentType',
            transformFilter: (params, values) => {
                values?.split(',').forEach((el, index) => {
                    params[`filters[contentType][${index}]`] = el;
                });
            },
        },
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
        { key: 'contentType', title: 'Chercher par type de contenu', label: 'Type de contenu', type: 'contentTypes' },
    ],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'title', label: 'Titre', width: '20%', sortable: true },
        { name: 'contentType.name', label: 'Type de contenu', width: '30%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getContentsAction(),
    changeFiltersActions: (props, page) => changeContentsFilters(props, page),
    dataSelector: contentsSelector,
    dataList: (selector) => selector.contents,
    duplicate: (props) => Api.contentsApi.duplicateContent(props),
    delete: (props) => Api.contentsApi.deleteContent(props),
    new: ({ setCreateDialog }) => setCreateDialog(true),
    links: {
        edit: (id) => `${Constant.CONTENTS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.CONTENTS_BASE_PATH}${Constant.CREATE_PATH}?contentId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'Le contenu a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer ce contenu ?',
    },
    wrapperComponent: DEFAULT_CRUD_LIST_COMPONENTS?.wrapperComponent,
    components: [...DEFAULT_CRUD_LIST_COMPONENTS?.components, { component: (props) => <CreateNewContentDialog {...props} /> }],
};

const CreateNewContentDialog = ({
    createDialog,
    setCreateDialog,
    formContentType,
    setAvailableCreateContent,
    setFormContentType,
    handleGetAvailable,
    contentTypes,
    availableCreateContent,
}) => {
    const navigate = useNavigate();

    return (
        <Dialog open={createDialog} onClose={() => setCreateDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontSize: 20 }}>Créer un contenu</DialogTitle>
            <DialogContent dividers>
                <Component.CmtSelect
                    label="Type de contenus"
                    required
                    id={`selectContentType`}
                    value={formContentType}
                    list={contentTypes}
                    getValue={(item) => item?.id}
                    getName={(item) => item?.name}
                    onChange={(e) => {
                        setAvailableCreateContent({ ...availableCreateContent, loading: true });
                        setFormContentType(e.target.value);
                        handleGetAvailable(e.target.value);
                    }}
                />

                {!availableCreateContent.loading && availableCreateContent.loaded && availableCreateContent.number <= 0 && (
                    <Box sx={{ mt: 3, width: '100%', borderRadius: 2, padding: 3, backgroundColor: (theme) => theme.palette.warning.light }}>
                        <Typography sx={{ color: (theme) => theme.palette.warning.main }}>
                            Attention, vous avez {availableCreateContent.createdNumber > availableCreateContent.maxObjectNb ? 'dépassé' : 'atteint'} le nombre de contenu que vous
                            pouvez créer avec ce type de contenu. ({availableCreateContent.createdNumber} / {availableCreateContent.maxNumber})
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
                                navigate(`${Constant.CONTENTS_BASE_PATH}${Constant.CREATE_PATH}?contentType=${formContentType}`);
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

export const ContentsList = () => {
    const dispatch = useDispatch();
    const [contentTypes, setContentTypes] = useState([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [formContentType, setFormContentType] = useState('');
    const [availableCreateContent, setAvailableCreateContent] = useState({
        loading: false,
        loaded: false,
        number: 0,
        createdNumber: 0,
        maxNumber: 0,
    });

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.getAllContentTypes({ pageType: false });
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
            listCrud={Crud?.contents?.list}
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
