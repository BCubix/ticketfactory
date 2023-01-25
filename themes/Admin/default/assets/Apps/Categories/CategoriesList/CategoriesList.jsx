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

import { categoriesSelector } from '@Redux/categories/categoriesSlice';
import { getCategoriesAction } from '@Redux/categories/categoriesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CategoriesList = () => {
    const { loading, categories, error } = useSelector(categoriesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [deleteEvents, setDeleteEvent] = useState(false);
    const [category, setCategory] = useState(null);
    const [path, setPath] = useState(null);

    const getCategory = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.categoriesApi.getOneCategory(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.CATEGORIES_BASE_PATH);

            return;
        }

        setCategory(result.category);
    };

    useEffect(() => {
        if (!id && !loading && !categories && !error) {
            dispatch(getCategoriesAction());
            return;
        } else if (id) {
            getCategory(id);
        }

        if (!id && categories) {
            setCategory(categories);
        }
    }, [id, loading, categories, error]);

    useEffect(() => {
        if (!category) {
            setPath(null);
        }

        let pathArray = [];
        let categoryCopy = { ...category };

        while (categoryCopy !== null) {
            pathArray.push({
                label: categoryCopy.name,
                path: `${Constant.CATEGORIES_BASE_PATH}/${categoryCopy.id}`,
            });

            categoryCopy = categoryCopy.parent ? { ...categoryCopy.parent } : null;
        }
        setPath(pathArray.reverse());
    }, [category]);

    const handleDelete = async (deleteId, deleteEvents) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.categoriesApi.deleteCategory(deleteId, deleteEvents);

        dispatch(getCategoriesAction());

        setDeleteDialog(null);
        setDeleteEvent(false);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.categoriesApi.duplicateCategory(id);

            if (result?.result) {
                NotificationManager.success('La catégorie a bien été dupliquée.', 'Succès', Constant.REDIRECTION_TIME);

                dispatch(getCategoriesAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title="Catégories">
                <Box display="flex" alignItems="center" pt={5}>
                    <Component.CmtBreadCrumb list={path} />
                    <Box pl={3} onClick={() => navigate(`${Constant.CATEGORIES_BASE_PATH}/${id || categories.id}${Constant.EDIT_PATH}`)}>
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
                                    Liste des catégories
                                </Typography>
                                <Component.CreateButton variant="contained" onClick={() => navigate(Constant.CATEGORIES_BASE_PATH + Constant.CREATE_PATH)}>
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.CategoriesList}
                            list={category?.children}
                            onEdit={(id) => {
                                navigate(`${Constant.CATEGORIES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            onClick={(elemId) => {
                                navigate(`${Constant.CATEGORIES_BASE_PATH}/${elemId}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onTranslate={(id, languageId) => {
                                navigate(`${Constant.CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}?categoryId=${id}&languageId=${languageId}`);
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
                        Voulez-vous supprimer les évènements qui sont rattachés à cette catégorie ou souhaitez-vous les rattacher à la catégorie parente ?
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
                            <FormControlLabel value={false} control={<Radio />} label={'Rattacher à la catégorie parente'} />
                        </RadioGroup>
                    </Box>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
