import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { CardContent, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { mediaCategoriesSelector } from '@Redux/mediaCategories/mediaCategoriesSlice';
import { getMediaCategoriesAction } from '@Redux/mediaCategories/mediaCategoriesSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const MediaCategoriesList = () => {
    const { loading, mediaCategories, error } = useSelector(mediaCategoriesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [deleteEvents, setDeleteEvent] = useState(false);
    const [mediaCategory, setMediaCategory] = useState(null);
    const [path, setPath] = useState(null);

    const getMediaCategory = async (id) => {
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
            getMediaCategory(id);
        }

        if (!id && mediaCategories) {
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

    return (
        <>
            <Component.CmtPageWrapper title="Catégories de média">
                <Box display="flex" alignItems="center" pt={5}>
                    <Component.CmtBreadCrumb list={path} />
                    <Box pl={3} onClick={() => navigate(`${Constant.MEDIA_CATEGORIES_BASE_PATH}/${id || mediaCategories.id}${Constant.EDIT_PATH}`)}>
                        <Component.EditCategoryLink component="span" variant="body1">
                            Modifier
                        </Component.EditCategoryLink>
                    </Box>
                </Box>

                <Component.CmtCard sx={{ width: '100%', mt: 2 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des catégories de média
                                </Typography>
                                <Component.CreateButton variant="contained" onClick={() => navigate(Constant.MEDIA_CATEGORIES_BASE_PATH + Constant.CREATE_PATH)}>
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.CategoriesList}
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
                                navigate(`${Constant.MEDIA_CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}?mediaCategoryId=${id}&languageId=${languageId}`);
                            }}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>

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
        </>
    );
};
