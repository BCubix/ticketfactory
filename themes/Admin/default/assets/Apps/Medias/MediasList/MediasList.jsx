import React, { useEffect, useState, useRef } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { CardContent, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { changeMediasFilters, getMediasAction, mediasSelector } from '@Apps/Medias/redux/medias/mediasSlice';
import CategoryIcon from '@mui/icons-material/Category';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';

const LIST_TYPE = [
    { label: 'Image', value: 'Image' },
    { label: 'Audio', value: 'Audio' },
    { label: 'Vidéo', value: 'Vidéo' },
    { label: 'Word', value: 'Word' },
    { label: 'Excel', value: 'Excel' },
    { label: 'Powerpoint', value: 'Powerpoint' },
    { label: 'Pdf', value: 'PDF' },
    { label: 'Text', value: 'Text' },
];

const SORT_LIST = [
    { label: 'ID', value: 'id' },
    { label: 'Activé', value: 'active' },
    { label: 'Titre', value: 'title' },
    { label: 'Type', value: 'documentType' },
    { label: 'Poids', value: 'documentSize' },
];

export const mediasListCrud = {
    title: 'Médias',
    listTitle: 'Liste des médias',
    filtersData: [
        { key: 'active', type: 'boolean' },
        { key: 'iframe', type: 'boolean' },
        'title',
        {
            key: 'category',
            transformFilter: (params, values) => {
                values?.split(',').forEach((el, index) => {
                    params[`filters[category][${index}]`] = el;
                });
            },
        },
        {
            key: 'type',
            transformFilter: (params, sort) => {
                if (typeof sort === 'string') {
                    sort = sort.split(',');
                }

                sort?.forEach((el, index) => {
                    params[`filters[type][${index}]`] = el;
                });
            },
        },
        'page',
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
        { key: 'active', title: 'Chercher par status', label: 'Actif ?', type: 'boolean' },
        { key: 'iframe', title: 'Chercher les iframes', label: 'Iframes ?', type: 'boolean' },
        { key: 'title', title: 'Chercher par titre', label: 'Titre', type: 'search' },
        {
            key: 'type',
            title: 'Chercher par type',
            label: 'Type',
            type: 'multipleList',
            icon: <CategoryIcon />,
            parameters: {
                nameValue: 'value',
                nameLabel: 'label',
            },
            list: LIST_TYPE,
        },
        {
            key: 'category',
            title: 'Chercher par catégorie',
            label: 'Catégorie',
            type: 'categories',
            icon: <CategoryIcon />,
            parameters: {
                nameValue: 'value',
                nameLabel: 'label',
            },
            getList: ({ categoriesList }) => categoriesList,
        },
        {
            component: ({ filters, changeFilters }) => (
                <Component.MediasSorters
                    value={filters.sort}
                    setValue={(newValue) => {
                        changeFilters({ ...filters, sort: newValue });
                    }}
                    list={SORT_LIST}
                />
            ),
        },
    ],
};

export const MediasList = ({ listCrud = Crud?.medias?.list }) => {
    const { loading, medias, filters, total, error } = useSelector(mediasSelector);
    const dispatch = useDispatch();
    const [createDialog, setCreateDialog] = useState(false);
    const [addIframeDialog, setAddIframeDialog] = useState(false);
    const [editIframeDialog, setEditIframeDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [mediaCategoriesList, setMediaCategoriesList] = useState(null);
    const [loadedImage, setLoadedImage] = useState([]);
    const [imageUploads, setImageUploads] = useState([]);
    const [sidebarDialog, setSidebarDialog] = useState(null);
    var idImageSidebar = useRef(0);

    useEffect(() => {
        if (!loading && !medias && !error) {
            dispatch(getMediasAction());
        }
    }, []);

    const handleEditMultiple = () => {
        const updatedArray = imageUploads.filter((item) => item.id !== idImageSidebar.current);
        setImageUploads(updatedArray);
        if (updatedArray.length >= 1) {
            idImageSidebar.current = updatedArray[0]?.id;
            setEditDialog(idImageSidebar.current);
            if (updatedArray.length === 1) {
                setSidebarDialog(false);
            }
            if (updatedArray.length === 0) {
                setEditDialog(null);
            }
        }
    };

    const handleSubmit = (imageArray) => {
        setCreateDialog(false);
        dispatch(getMediasAction());
        const parsedImageArray = imageArray.map((imgStr) => JSON.parse(imgStr));

        if (parsedImageArray.length > 1) NotificationManager.success('Vos éléments ont bien été ajoutés.', 'Succès', Constant.REDIRECTION_TIME);
        else NotificationManager.success('Votre élément a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);

        setImageUploads(parsedImageArray);
        idImageSidebar.current = parsedImageArray[0]?.id;
        setEditDialog(idImageSidebar.current);
        if (parsedImageArray.length > 1) {
            setSidebarDialog(true);
        }
    };

    const handleAddIframe = (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.createIframeMedia(values);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            dispatch(getMediasAction());
            setAddIframeDialog(false);
            NotificationManager.success('Votre élément a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
        });
    };

    const handleEditIframe = (id, values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.editIframeMedia(id, values);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            dispatch(getMediasAction());
            setEditIframeDialog(false);
            NotificationManager.success('Votre élément a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
        });
    };

    const handleDelete = async (id) => {
        apiMiddleware(dispatch, async () => {
            await Api.mediasApi.deleteMedia(id);
            dispatch(getMediasAction());

            setDeleteDialog(null);
            setEditDialog(null);
            setEditIframeDialog(null);
        });
    };

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.getAllMediaCategories();
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }

            setMediaCategoriesList(result.mediaCategories);
        });
    }, []);

    return (
        <Component.CmtPageWrapper title="Médias">
            <Component.CmtCard sx={{ height: '100%', mt: 5 }}>
                <Component.CmtCardHeader
                    title={
                        <Box display="flex" justifyContent={'space-between'} alignItems="center">
                            <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                {listCrud?.title}
                                {medias && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + medias.length} sur ${total})`}
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                                <Component.CreateButton variant="contained" onClick={() => setAddIframeDialog(true)} id="addIframeMediaButton" sx={{ marginRight: 3 }}>
                                    Ajouter un iframe
                                </Component.CreateButton>
                                <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)} id="createMediaButton">
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        </Box>
                    }
                />
                <CardContent sx={{ height: '100%' }}>
                    <Component.CmtFiltersList
                        filters={filters}
                        filtersList={listCrud?.filterList}
                        changeFilters={(values) => dispatch(changeMediasFilters(values))}
                        categoriesList={mediaCategoriesList}
                    />

                    <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                        {medias?.map((item, index) => (
                            <Component.CmtMediaElement
                                id={`mediaItem-${item.id}`}
                                key={index}
                                onClick={() => {
                                    item.iframe ? setEditIframeDialog(item.id) : setEditDialog(item.id);
                                }}
                            >
                                <Component.CmtDisplayMediaType media={item} displayThumbnail width={'100%'} height={'auto'} />
                            </Component.CmtMediaElement>
                        ))}
                    </Box>

                    <Component.CmtPagination
                        page={filters.page}
                        total={total}
                        limit={filters.limit}
                        setPage={(newValue) => dispatch(changeMediasFilters({ ...filters }, newValue))}
                        setLimit={(newValue) => {
                            dispatch(changeMediasFilters({ ...filters, limit: newValue }));
                        }}
                        length={medias?.length}
                    />
                </CardContent>
            </Component.CmtCard>

            <Dialog fullWidth maxWidth="md" open={createDialog} onClose={() => setCreateDialog(false)}>
                <DialogTitle sx={{ fontSize: 20 }}>Ajouter un fichier</DialogTitle>
                <DialogContent>
                    <Component.CreateMedia handleSubmit={handleSubmit} setLoadedImage={setLoadedImage} loadedImage={loadedImage} />
                </DialogContent>
            </Dialog>

            <Dialog fullWidth maxWidth="lg" open={addIframeDialog} onClose={() => setAddIframeDialog(false)}>
                <DialogTitle sx={{ fontSize: 20 }}>Ajouter un iframe</DialogTitle>
                <DialogContent>
                    <Component.IframeMediaForm
                        handleSubmit={handleAddIframe}
                        onCancel={() => {
                            setAddIframeDialog(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog fullWidth maxWidth="lg" open={Boolean(editIframeDialog)} onClose={() => setEditIframeDialog(null)}>
                <DialogTitle sx={{ fontSize: 20 }}>Modifier un iframe</DialogTitle>
                <DialogContent>
                    <Component.IframeMediaForm
                        id={editIframeDialog}
                        handleSubmit={(values) => handleEditIframe(editIframeDialog, values)}
                        onCancel={() => {
                            setEditIframeDialog(null);
                        }}
                        deleteElement={(id) => setDeleteDialog(id)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog fullWidth maxWidth="lg" open={Boolean(editDialog)} onClose={() => setEditDialog(false)} PaperProps={{ sx: { overflow: 'visible' } }}>
                {editDialog && sidebarDialog && (
                    <Component.ImageUploads
                        imageUploads={imageUploads}
                        onSelect={(id) => {
                            idImageSidebar.current = id;
                            setEditDialog(idImageSidebar.current);
                        }}
                    />
                )}
                <DialogTitle sx={{ fontSize: 20 }}>Modifier un fichier</DialogTitle>
                <DialogContent dividers>
                    <Component.EditMedia
                        id={editDialog}
                        onCancel={() => {
                            setEditDialog(null);
                            setSidebarDialog(false);
                        }}
                        editSuccess={() => {
                            if (sidebarDialog) {
                                handleEditMultiple();
                            } else setEditDialog(null);
                        }}
                        deleteElement={(id) => setDeleteDialog(id)}
                    />
                </DialogContent>
            </Dialog>

            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer cet élément ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </Component.CmtPageWrapper>
    );
};
