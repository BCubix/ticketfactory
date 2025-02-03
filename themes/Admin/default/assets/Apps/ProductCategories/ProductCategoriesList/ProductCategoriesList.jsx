import { CardContent, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import {
    changeProductCategoriesFilters,
    getProductCategoriesAction,
    productCategoriesSelector,
    updateProductCategoriesFilters,
} from '@Apps/ProductCategories/redux/productCategories/productCategoriesSlice';
import { getProductsAction } from '@Apps/Products/redux/products/productsSlice';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { copyData } from '@Services/utils/copyData';
import { checkUserAccess } from '@Services/utils/checkUserAccess';
import { userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { getUserRoles } from '@Services/utils/getUserRoles';

export const productCategoriesListCrud = {
    title: 'Catégories de produits',
    listTitle: 'Liste des catégories de produits',
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
    loadDataAction: () => getProductCategoriesAction(),
    dataSelector: productCategoriesSelector,
    dataList: (selector) => selector.productCategories?.children,
    changeFiltersActions: (props) => changeProductCategoriesFilters(props),
    duplicate: (props) => Api.productCategories.duplicateProductCategory(props),
    delete: (props) => Api.productCategories.deleteProductCategory(props),
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_PRODUCT_CATEGORY_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_PRODUCT_CATEGORY_EDIT'),
        delete: (userRoles) => checkUserAccess(userRoles, 'ROLE_PRODUCT_CATEGORY_DELETE'),
    },
    links: {
        new: () => `${Constant.PRODUCT_CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.PRODUCT_CATEGORIES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.PRODUCT_CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}?productCategoryId=${id}&languageId=${languageId}`,
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
            component: ({ listCrud, productCategory, navigate, setDeleteDialog, handleDuplicate, path, handleDragEnd, handleResetFilters }) => {
                return (
                    <Component.ListTable
                        contextualMenu
                        table={listCrud?.tableList}
                        list={productCategory?.children}
                        onEdit={(id) => {
                            navigate(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                        }}
                        onDelete={(id) => setDeleteDialog(id)}
                        onClick={(elemId) => {
                            handleResetFilters();
                            navigate(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}/${elemId}`);
                        }}
                        onDuplicate={(id) => {
                            handleDuplicate(id);
                        }}
                        onTranslate={(id, languageId) => {
                            navigate(
                                `${Constant.PRODUCT_CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}?productCategoryId=${id}&languageId=${languageId}${
                                    path ? `?parentId=${path.at(-1)?.id}` : ''
                                }`
                            );
                        }}
                        onDragEnd={handleDragEnd}
                    />
                );
            },
        },
    ],
    headerComponents: [
        {
            component: ({ listCrud, productCategory, path, navigate, handleResetFilters, userRoles }) => (
                <Box display="flex" alignItems="center" pt={5}>
                    <Component.CmtBreadCrumb list={path} additionalClick={handleResetFilters} />
                    {listCrud.checkUserAccess.edit(userRoles) && (
                        <Box pl={3} onClick={() => navigate(listCrud?.links?.edit(productCategory.id))}>
                            <Component.EditCategoryLink component="span" variant="body1">
                                Modifier
                            </Component.EditCategoryLink>
                        </Box>
                    )}
                </Box>
            ),
        },
    ],
    deleteComponent: ({ deleteDialog, setDeleteDialog, setDeleteProducts, deleteProducts, handleDelete }) => (
        <Component.DeleteDialog
            open={deleteDialog ? true : false}
            onCancel={() => {
                setDeleteDialog(null);
                setDeleteProducts(false);
            }}
            deleteText={'Valider'}
            onDelete={() => handleDelete(deleteDialog, deleteProducts)}
        >
            <Box textAlign="center" py={3}>
                <Typography component="p">
                    Voulez-vous supprimer les produits qui sont rattachés à cette catégorie ou souhaitez-vous les rattacher à la catégorie parente ?
                </Typography>

                <Box className="flex row-center" mt={5}>
                    <RadioGroup
                        defaultValue={false}
                        name="delete-event-radio-choice"
                        value={deleteProducts}
                        onChange={(e) => {
                            setDeleteProducts(e.target.value);
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

export const ProductCategoriesList = ({ listCrud = Crud?.productCategories?.list, ...props }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { loading, productCategories, filters, error } = useSelector(productCategoriesSelector);
    const { user } = useSelector(userProfileSelector);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [deleteProducts, setDeleteProducts] = useState(false);
    const [productCategory, setProductCategory] = useState(null);
    const [path, setPath] = useState(null);

    const userRoles = useMemo(() => {
        return getUserRoles(user);
    }, [user]);

    const getProductCategory = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.productCategoriesApi.getOneProductCategory(id, filters);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PRODUCT_CATEGORIES_BASE_PATH);
                return;
            }

            setProductCategory(result.productCategory);
        });
    };

    useEffect(() => {
        if (!id && !loading && !productCategories && !error) {
            dispatch(getProductCategoriesAction());
            return;
        } else if (id) {
            getProductCategory();
            return;
        }

        if (!id && productCategories && !loading && !error) {
            setProductCategory(productCategories);
        }
    }, [id, loading, productCategories, error]);

    useEffect(() => {
        if (!productCategory) {
            setPath(null);
        }

        let pathArray = [];
        let productCategoryCopy = { ...productCategory };

        while (productCategoryCopy !== null) {
            pathArray.push({
                label: productCategoryCopy.name,
                path: `${Constant.PRODUCT_CATEGORIES_BASE_PATH}/${productCategoryCopy.id}`,
                id: productCategoryCopy.id,
            });

            productCategoryCopy = productCategoryCopy.parent ? { ...productCategoryCopy.parent } : null;
        }
        setPath(pathArray.reverse());
    }, [productCategory]);

    const handleDelete = async (deleteId, deleteProduct) => {
        apiMiddleware(dispatch, async () => {
            await Api.productCategoriesApi.deleteProductCategory(deleteId, deleteProduct);

            dispatch(getProductCategoriesAction());
            dispatch(getProductsAction());

            setDeleteDialog(null);
            setDeleteProducts(false);
        });
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.productCategoriesApi.duplicateProductCategory(id);

            if (result?.result) {
                NotificationManager.success('La catégorie de produit a bien été dupliquée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getProductCategoriesAction());
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

        let svProductCategories = Object.values(copyData(productCategory?.children));

        const removedElement = svProductCategories.splice(indexSrc, 1)[0];
        svProductCategories.splice(indexDest, 0, removedElement);

        setProductCategory({ ...productCategory, children: svProductCategories });

        apiMiddleware(dispatch, async () => {
            const result = await Api.productCategoriesApi.orderProductCategories(removedElement.id, indexSrc, indexDest);
            if (result?.result) {
                NotificationManager.success('La catégorie de produit a bien changé de position.', 'Succès', Constant.REDIRECTION_TIME);
                if (!id) {
                    dispatch(getProductCategoriesAction());
                } else {
                    getProductCategory();
                }
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    const handleResetFilters = () => {
        dispatch(updateProductCategoriesFilters({ filters: { active: null, name: '' } }));
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
                            objectData={useSelector(productCategoriesSelector)}
                            listCrud={listCrud}
                            navigate={navigate}
                            dispatch={dispatch}
                            handleDuplicate={handleDuplicate}
                            setDeleteDialog={setDeleteDialog}
                            path={path}
                            productCategories={productCategories}
                            productCategory={productCategory}
                            handleResetFilters={handleResetFilters}
                            userRoles={userRoles}
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
                                {listCrud?.checkUserAccess?.new(userRoles) && (listCrud?.new || listCrud?.links?.new) && (
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
                                    productCategories={productCategories}
                                    productCategory={productCategory}
                                    handleDragEnd={handleDragEnd}
                                    listCrud={listCrud}
                                    path={path}
                                    objectData={useSelector(productCategoriesSelector)}
                                    navigate={navigate}
                                    dispatch={dispatch}
                                    handleDuplicate={handleDuplicate}
                                    setDeleteDialog={setDeleteDialog}
                                    handleResetFilters={handleResetFilters}
                                    userRoles={userRoles}
                                    {...props}
                                />
                            );
                        })}
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            {listCrud?.deleteComponent ? (
                <listCrud.deleteComponent {...props} {...{ deleteDialog, setDeleteDialog, setDeleteProducts, deleteProducts, handleDelete }} />
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
