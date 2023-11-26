import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { CardContent, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { mediaCategoriesSelector } from '@Apps/MediaCategories/redux/mediaCategories/mediaCategoriesSlice';
import { getMediaCategoriesAction } from '@Apps/MediaCategories/redux/mediaCategories/mediaCategoriesSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { copyData } from '@Services/utils/copyData';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

export const mediaCategoriesListCrud = {
    title: 'Catégories',
    listTitle: 'Liste des catégories',
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '50%', sortable: true },
        { name: 'shortDescription', label: 'Description courte', width: '25%' },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    links: {
        new: () => `${Constant.CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.CATEGORIES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}?categoryId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'La catégorie a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette catégories ?',
    },
    wrapperComponent: DEFAULT_CRUD_LIST_COMPONENTS.wrapperComponent,
    components: [
        {
            component: ({ listCrud, mediaCategory, navigate, setDeleteDialog, handleDuplicate, path, handleDragEnd }) => (
                <Component.ListTable
                    contextualMenu
                    table={listCrud?.tableList}
                    list={mediaCategory?.children}
                    onEdit={(id) => {
                        navigate(`${Constant.MEDIA_CATEGORIES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                    }}
                    onDelete={(id) => setDeleteDialog(id)}
                    onClick={(elemId) => {
                        navigate(`${Constant.MEDIA_CATEGORIES_BASE_PATH}/${elemId}`);
                    }}
                    onDuplicate={(id) => {
                        handleDuplicate(id);
                    }}
                    onTranslate={(id, languageId) => {
                        navigate(
                            `${Constant.MEDIA_CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}?mediaCategoryId=${id}&languageId=${languageId}${
                                path ? `&parentId=${path.at(-1)?.id}` : ''
                            }`
                        );
                    }}
                    onDragEnd={handleDragEnd}
                />
            ),
        },
    ],
    headerComponents: [
        {
            component: ({ listCrud, mediaCategories, path, navigate }) => (
                <Box display="flex" alignItems="center" pt={5}>
                    <Component.CmtBreadCrumb list={path} />
                    <Box pl={3} onClick={() => navigate(listCrud?.links?.edit(mediaCategories.id))}>
                        <Component.EditCategoryLink component="span" variant="body1">
                            Modifier
                        </Component.EditCategoryLink>
                    </Box>
                </Box>
            ),
        },
    ],
    deleteComponent: ({ deleteDialog, setDeleteDialog, setDeleteEvent, deleteEvents, handleDelete }) => (
        <Component.DeleteDialog
            open={deleteDialog ? true : false}
            onCancel={() => {
                setDeleteDialog(null);
                setDeleteEvent(false);
            }}
            deleteText={'Valider'}
            onDelete={() => handleDelete(deleteDialog, deleteEvents)}
        >
            <Box textAlign="center" py={3}>
                <Typography component="p">
                    Voulez-vous supprimer les évènements qui sont rattachés à cette catégorie de média ou souhaitez-vous les rattacher à la catégorie de média parente ?
                </Typography>

                <Box className="flex row-center" mt={5}>
                    <RadioGroup
                        defaultValue={false}
                        name="delete-event-radio-choice"
                        value={deleteEvents}
                        onChange={(e) => {
                            setDeleteEvent(e.target.value);
                        }}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            width: '100%',
                        }}
                    >
                        <FormControlLabel value={true} control={<Radio />} label={'Suprimer'} />
                        <FormControlLabel value={false} control={<Radio />} label={'Rattacher à la catégorie de média parente'} />
                    </RadioGroup>
                </Box>
            </Box>
        </Component.DeleteDialog>
    ),
};

export const MediaCategoriesList = ({ listCrud = Crud?.mediaCategories?.list, ...props }) => {
    const { loading, mediaCategories, error } = useSelector(mediaCategoriesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [deleteEvents, setDeleteEvent] = useState(false);
    const [mediaCategory, setMediaCategory] = useState(null);
    const [path, setPath] = useState(null);

    const getMediaCategory = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.getOneMediaCategory(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.MEDIA_CATEGORIES_BASE_PATH);
                return;
            }

            setMediaCategory(result.mediaCategory);
        });
    };

    useEffect(() => {
        if (!id && !loading && !mediaCategories && !error) {
            dispatch(getMediaCategoriesAction());
            return;
        } else if (id) {
            getMediaCategory();
            return;
        }

        if (!id && mediaCategories && !loading && !error) {
            setMediaCategory(mediaCategories);
        }
    }, [id, loading, mediaCategories, error]);

    useEffect(() => {
        if (!mediaCategory) {
            setPath(null);
        }

        let pathArray = [];
        let mediaCategoryCopy = { ...mediaCategory };

        while (mediaCategoryCopy !== null) {
            pathArray.push({
                label: mediaCategoryCopy.name,
                path: `${Constant.MEDIA_CATEGORIES_BASE_PATH}/${mediaCategoryCopy.id}`,
                id: mediaCategoryCopy.id,
            });

            mediaCategoryCopy = mediaCategoryCopy.parent ? { ...mediaCategoryCopy.parent } : null;
        }
        setPath(pathArray.reverse());
    }, [mediaCategory]);

    const handleDelete = async (deleteId, deleteEvents) => {
        apiMiddleware(dispatch, async () => {
            await Api.mediaCategoriesApi.deleteMediaCategory(deleteId, deleteEvents);

            dispatch(getMediaCategoriesAction());

            setDeleteDialog(null);
            setDeleteEvent(false);
        });
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.duplicateMediaCategory(id);

            if (result?.result) {
                NotificationManager.success('La catégorie de média a bien été dupliquée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getMediaCategoriesAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        let indexSrc = result.source.index;
        let indexDest = result.destination.index;

        if (indexSrc === indexDest) {
            return;
        }

        let svCategories = Object.values(copyData(mediaCategory?.children));

        const removedElement = svCategories.splice(indexSrc, 1)[0];
        svCategories.splice(indexDest, 0, removedElement);

        setMediaCategory({ ...mediaCategory, children: svCategories });

        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.orderCategories(removedElement.id, indexSrc, indexDest);
            if (result?.result) {
                NotificationManager.success('La catégorie a bien changé de position.', 'Succès', Constant.REDIRECTION_TIME);
                if (!id) {
                    dispatch(getMediaCategoriesAction());
                } else {
                    getMediaCategory();
                }
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title="Catégories de média">
                {listCrud?.headerComponents?.map((item, index) => {
                    const { component: ItemComponent } = item;

                    if (!ItemComponent) {
                        return <></>;
                    }

                    return (
                        <ItemComponent
                            key={index}
                            objectData={useSelector(mediaCategoriesSelector)}
                            listCrud={listCrud}
                            navigate={navigate}
                            dispatch={dispatch}
                            handleDuplicate={handleDuplicate}
                            setDeleteDialog={setDeleteDialog}
                            path={path}
                            {...props}
                        />
                    );
                })}

                <Component.CmtCard sx={{ width: '100%', mt: 2 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des catégories de média
                                </Typography>
                                <Component.CreateButton
                                    variant="contained"
                                    onClick={() => navigate(`${Constant.MEDIA_CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}${path ? `?parentId=${path.at(-1)?.id}` : ''}`)}
                                >
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        {listCrud?.components?.map((item, index) => {
                            const { component: ItemComponent } = item;

                            if (!ItemComponent) {
                                return <></>;
                            }

                            return (
                                <ItemComponent
                                    key={index}
                                    mediaCategories={mediaCategories}
                                    mediaCategory={mediaCategory}
                                    handleDragEnd={handleDragEnd}
                                    listCrud={listCrud}
                                    path={path}
                                    objectData={useSelector(mediaCategoriesSelector)}
                                    navigate={navigate}
                                    dispatch={dispatch}
                                    handleDuplicate={handleDuplicate}
                                    setDeleteDialog={setDeleteDialog}
                                    {...props}
                                />
                            );
                        })}
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            {listCrud?.deleteComponent ? (
                <listCrud.deleteComponent {...props} {...{ deleteDialog, setDeleteDialog, setDeleteEvent, deleteEvents, handleDelete }} />
            ) : (
                <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                    <Box textAlign="center" py={3}>
                        <Typography component="p">{listCrud?.messages?.confirmationDelete}</Typography>

                        <Typography component="p">Cette action est irréversible.</Typography>
                    </Box>
                </Component.DeleteDialog>
            )}
        </>
    );
};
