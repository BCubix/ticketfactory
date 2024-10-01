import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { CardContent, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { categoriesSelector, changeCategoriesFilters, getCategoriesAction, updateCategoriesFilters } from '@Apps/Categories/redux/categories/categoriesSlice';
import { loginFailure } from '@Apps/Auth/redux/userProfile/userProfileSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { copyData } from '@Services/utils/copyData';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

export const categoriesListCrud = {
    title: 'Catégories',
    listTitle: 'Liste des catégories',
    tableContextualMenu: true,
    filtersData: [{ key: 'active', type: 'boolean' }, 'name'],
    filterList: [
        { key: 'active', title: 'Chercher par status', label: 'Actif', type: 'boolean' },
        { key: 'name', title: 'Chercher par nom', label: 'Nom', type: 'search' },
    ],
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '50%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getCategoriesAction(),
    dataSelector: categoriesSelector,
    changeFiltersActions: (props) => changeCategoriesFilters(props),
    dataList: (selector) => selector.categories?.children,
    duplicate: (props) => Api.categoriesApi.duplicateCategory(props),
    delete: (props) => Api.categoriesApi.deleteCategory(props),
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
            component: ({ objectData, listCrud, dispatch }) => (
                <Component.CmtFiltersList
                    filters={objectData?.filters}
                    filtersList={listCrud?.filterList}
                    changeFilters={(values) => dispatch(listCrud?.changeFiltersActions(values))}
                />
            ),
        },
        {
            component: ({ listCrud, category, navigate, setDeleteDialog, handleDuplicate, path, handleDragEnd, handleResetFilters }) => (
                <Component.ListTable
                    contextualMenu
                    table={listCrud?.tableList}
                    list={category?.children}
                    onEdit={(id) => {
                        navigate(`${Constant.CATEGORIES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                    }}
                    onDelete={(id) => setDeleteDialog(id)}
                    onClick={(elemId) => {
                        handleResetFilters();
                        navigate(`${Constant.CATEGORIES_BASE_PATH}/${elemId}`);
                    }}
                    onDuplicate={(id) => {
                        handleDuplicate(id);
                    }}
                    onTranslate={(id, languageId) => {
                        navigate(`${Constant.CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}?categoryId=${id}&languageId=${languageId}${path ? `?parentId=${path.at(-1)?.id}` : ''}`);
                    }}
                    onDragEnd={handleDragEnd}
                    contextualClickLabel={
                        <>
                            <SubdirectoryArrowRightIcon sx={{ marginRight: 2 }} /> Sous-catégories
                        </>
                    }
                    onContextualClick={(elem) => {
                        handleResetFilters();
                        navigate(`${Constant.CATEGORIES_BASE_PATH}/${elem?.id}`);
                    }}
                />
            ),
        },
    ],
    headerComponents: [
        {
            component: ({ listCrud, category, path, navigate, handleResetFilters }) => (
                <Box display="flex" alignItems="center" pt={5}>
                    <Component.CmtBreadCrumb list={path} additionalClick={handleResetFilters} />
                    <Box
                        pl={3}
                        onClick={() => {
                            navigate(listCrud?.links?.edit(category.id));
                        }}
                    >
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
    ),
};

export const CategoriesList = ({ listCrud = Crud?.categories?.list, ...props }) => {
    const { loading, categories, filters, error } = useSelector(categoriesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [deleteEvents, setDeleteEvent] = useState(false);
    const [category, setCategory] = useState(null);
    const [path, setPath] = useState(null);

    const getCategory = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.categoriesApi.getOneCategory(id, filters);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CATEGORIES_BASE_PATH);
                return;
            }

            setCategory(result.category);
        });
    };

    useEffect(() => {
        if (!id && !loading && !categories && !error) {
            dispatch(getCategoriesAction());
            return;
        } else if (id) {
            getCategory();
            return;
        }

        if (!id && categories && !loading && !error) {
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
                id: categoryCopy.id,
            });

            categoryCopy = categoryCopy.parent ? { ...categoryCopy.parent } : null;
        }
        setPath(pathArray.reverse());
    }, [category]);

    const isFiltered = useMemo(() => {
        let filtered = false;

        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                filtered = true;
            }
        });

        return filtered;
    }, [filters]);

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

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        let indexSrc = result.source.index;
        let indexDest = result.destination.index;

        if (indexSrc === indexDest) {
            return;
        }

        let svCategories = Object.values(copyData(category?.children));

        const removedElement = svCategories.splice(indexSrc, 1)[0];
        svCategories.splice(indexDest, 0, removedElement);

        setCategory({ ...category, children: svCategories });

        apiMiddleware(dispatch, async () => {
            const result = await Api.categoriesApi.orderCategories(removedElement.id, indexSrc, indexDest);
            if (result?.result) {
                NotificationManager.success('La catégorie a bien changé de position.', 'Succès', Constant.REDIRECTION_TIME);
                if (!id) {
                    dispatch(getCategoriesAction());
                } else {
                    getCategory();
                }
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    const handleResetFilters = () => {
        dispatch(updateCategoriesFilters({ filters: { active: null, name: '' } }));
    };

    return (
        <>
            <Component.CmtPageWrapper title={listCrud?.title || ''}>
                {listCrud?.headerComponents?.map((item, index) => {
                    const { component: ItemComponent } = item;

                    if (!ItemComponent) {
                        return <></>;
                    }

                    return (
                        <ItemComponent
                            key={index}
                            objectData={useSelector(categoriesSelector)}
                            listCrud={listCrud}
                            navigate={navigate}
                            dispatch={dispatch}
                            handleDuplicate={handleDuplicate}
                            setDeleteDialog={setDeleteDialog}
                            path={path}
                            handleResetFilters={handleResetFilters}
                            {...props}
                        />
                    );
                })}

                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box className="list-header">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    {listCrud?.listTitle}
                                </Typography>
                                {(listCrud?.new || listCrud?.links?.new) && (
                                    <Component.CreateButton
                                        variant="contained"
                                        onClick={() => (listCrud?.new ? listCrud?.new({ listCrud, ...props }) : navigate(listCrud.links.new()))}
                                    >
                                        Nouveau
                                    </Component.CreateButton>
                                )}
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
                                    categories={categories}
                                    category={category}
                                    handleDragEnd={isFiltered ? null : handleDragEnd}
                                    listCrud={listCrud}
                                    path={path}
                                    objectData={useSelector(categoriesSelector)}
                                    navigate={navigate}
                                    dispatch={dispatch}
                                    handleDuplicate={handleDuplicate}
                                    setDeleteDialog={setDeleteDialog}
                                    handleResetFilters={handleResetFilters}
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
