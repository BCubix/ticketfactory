import React, { useEffect, useMemo, useState } from 'react';

import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CardContent, Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { getUserRoles } from '@Services/utils/getUserRoles';

export const DEFAULT_CRUD_LIST_COMPONENTS = {
    wrapperComponent: (props) => <Component.CmtCrudList {...props} />,
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
            component: ({ listCrud, objectData, navigate, handleDuplicate, dispatch, setDeleteDialog, ...props }) => (
                <Component.ListTable
                    contextualMenu={Boolean(listCrud?.tableContextualMenu)}
                    table={listCrud?.tableList}
                    list={listCrud?.dataList(objectData)}
                    onEdit={
                        listCrud?.links?.edit
                            ? (id) => {
                                  navigate(listCrud?.links?.edit(id));
                              }
                            : null
                    }
                    onDuplicate={
                        listCrud?.duplicate
                            ? (id) => {
                                  handleDuplicate(id);
                              }
                            : null
                    }
                    onTranslate={
                        listCrud?.links?.translate
                            ? (id, languageId) => {
                                  navigate(listCrud?.links?.translate(id, languageId));
                              }
                            : null
                    }
                    onClick={
                        listCrud?.links?.detail
                            ? (itemId) => {
                                  navigate(listCrud?.links?.detail(itemId));
                              }
                            : null
                    }
                    onPreview={
                        listCrud?.preview || listCrud?.links?.preview
                            ? (item) => {
                                  if (listCrud?.preview) {
                                      listCrud.preview(item);
                                  } else {
                                      navigate(listCrud?.links?.preview(item));
                                  }
                              }
                            : null
                    }
                    disableDeleteFunction={listCrud?.disableDeleteFunction}
                    onDelete={listCrud?.delete ? (id) => setDeleteDialog(id) : null}
                    filters={objectData?.filters}
                    changeFilters={(newFilters) => dispatch(listCrud?.changeFiltersActions(newFilters))}
                    {...props}
                />
            ),
        },
        {
            component: ({ objectData, listCrud, dispatch }) => {
                if (!listCrud?.pagination) {
                    return <></>;
                }

                return (
                    <Component.CmtPagination
                        page={objectData?.filters?.page}
                        total={objectData?.total}
                        limit={objectData?.filters.limit}
                        setPage={(newValue) => dispatch(listCrud?.changeFiltersActions({ ...objectData?.filters }, newValue))}
                        setLimit={(newValue) => {
                            dispatch(listCrud?.changeFiltersActions({ ...objectData?.filters, limit: newValue }));
                        }}
                        length={listCrud?.dataList(objectData)?.length}
                    />
                );
            },
        },
    ],
};

export const CmtCrudList = ({ listCrud, ...props }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);
    const { user } = useSelector(userProfileSelector);
    const objectData = useSelector(listCrud.dataSelector);

    const userRoles = useMemo(() => {
        return getUserRoles(user);
    }, [user]);

    const [accessUserCreate, accessUserEdit, accessUserDelete] = useMemo(() => {
        return [
            !listCrud.checkUserAccess?.new || listCrud.checkUserAccess?.new(userRoles),
            !listCrud.checkUserAccess?.edit || listCrud.checkUserAccess?.edit(userRoles),
            !listCrud.checkUserAccess?.delete || listCrud.checkUserAccess?.delete(userRoles),
        ];
    }, [userRoles]);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!objectData?.loading && !listCrud?.dataList(objectData) && !objectData?.error) {
            dispatch(listCrud?.loadDataAction());
        }
        setLoading(objectData?.loading);
    }, []);

    const handleDelete = async (id) => {
        const result = await listCrud.delete(id);
        if (!result?.result && result?.error?.httpcode !== 500) {
            NotificationManager.error(result?.error?.message, 'Erreur', Constant.REDIRECTION_TIME);
        }

        if (result?.result) {
            dispatch(listCrud?.loadDataAction());
        }

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await listCrud?.duplicate(id);
            if (result?.result) {
                NotificationManager.success(listCrud?.messages?.duplicateValidation || "L'objet à bien été dupliqué.", 'Succès', Constant.REDIRECTION_TIME);
                dispatch(listCrud?.loadDataAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
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
                            objectData={objectData}
                            listCrud={listCrud}
                            navigate={navigate}
                            dispatch={dispatch}
                            handleDuplicate={handleDuplicate}
                            setDeleteDialog={setDeleteDialog}
                            accessUserCreate={accessUserCreate}
                            accessUserEdit={accessUserEdit}
                            accessUserDelete={accessUserDelete}
                            {...props}
                        />
                    );
                })}

                <Component.CmtCard className="fullwidth margin-top-5">
                    <Component.CmtCardHeader
                        title={
                            <Box className="list-header">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    {listCrud?.listTitle}{' '}
                                    {listCrud?.pagination &&
                                        listCrud?.dataList(objectData) &&
                                        `(${((objectData?.filters?.page || 1) - 1) * (objectData?.filters?.limit || 0) + 1} - ${
                                            ((objectData?.filters?.page || 1) - 1) * (objectData?.filters?.limit || 0) + listCrud?.dataList(objectData)?.length
                                        } sur ${objectData?.total})`}
                                    {!listCrud?.pagination && `(${listCrud?.dataList(objectData)?.length})`}
                                </Typography>
                                
                                {listCrud?.headerAction && <listCrud.headerAction listCrud navigate={navigate} {...props} />}

                                {accessUserCreate && (listCrud?.new || listCrud?.links?.new) && (
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
                    {loading ? (
                            <>
                                <Component.CmtSkeletonList numberLines={10} />
                            </>
                        ) : (
                            listCrud?.components?.map((item, index) => {
                                const { component: ItemComponent } = item;

                                if (!ItemComponent) {
                                    return <></>;
                                }

                                return (
                                    <ItemComponent
                                        key={index}
                                        objectData={objectData}
                                        listCrud={listCrud}
                                        navigate={navigate}
                                        dispatch={dispatch}
                                        handleDuplicate={handleDuplicate}
                                        setDeleteDialog={setDeleteDialog}
                                        accessUserCreate={accessUserCreate}
                                        accessUserEdit={accessUserEdit}
                                        accessUserDelete={accessUserDelete}
                                        {...props}
                                    />
                                );
                            })
                        )}
                    </CardContent>
                </Component.CmtCard>

                {listCrud?.bottomComponents?.map((item, index) => {
                    const { component: ItemComponent } = item;

                    if (!ItemComponent) {
                        return <></>;
                    }

                    return (
                        <ItemComponent
                            key={index}
                            objectData={objectData}
                            listCrud={listCrud}
                            navigate={navigate}
                            dispatch={dispatch}
                            handleDuplicate={handleDuplicate}
                            setDeleteDialog={setDeleteDialog}
                            accessUserCreate={accessUserCreate}
                            accessUserEdit={accessUserEdit}
                            accessUserDelete={accessUserDelete}
                            {...props}
                        />
                    );
                })}
            </Component.CmtPageWrapper>
            {listCrud?.deleteComponent ? (
                <listCrud.deleteComponent deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} handleDelete={handleDelete} {...props} />
            ) : (
                <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                    <Box className="block-delete">
                        <Typography component="p">{listCrud?.messages?.confirmationDelete}</Typography>

                        <Typography component="p">Cette action est irréversible.</Typography>
                    </Box>
                </Component.DeleteDialog>
            )}
        </>
    );
};
