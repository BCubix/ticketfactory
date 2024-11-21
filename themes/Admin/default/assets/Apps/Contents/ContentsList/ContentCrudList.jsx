import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CardContent, Tooltip, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Api } from '@/AdminService/Api';
import { useSelector } from 'react-redux';
import { userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { getUserRoles } from '@Services/utils/getUserRoles';

export const DEFAULT_CONTENT_CRUD_LIST_COMPONENTS = {
    wrapperComponent: (props) => <Component.CmtCrudList {...props} />,
    components: [
        {
            component: ({ objectData, listCrud, dispatch }) => (
                <Component.CmtFiltersList
                    filters={objectData?.filters}
                    filtersList={listCrud?.filterList}
                    changeFilters={(values) => dispatch(listCrud?.changeFiltersActions(objectData, values))}
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
                    changeFilters={(newFilters) => dispatch(listCrud?.changeFiltersActions(objectData, newFilters))}
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
                        setPage={(newValue) => dispatch(listCrud?.changeFiltersActions(objectData, { ...objectData?.filters }, newValue))}
                        setLimit={(newValue) => {
                            dispatch(listCrud?.changeFiltersActions(objectData, { ...objectData?.filters, limit: newValue }));
                        }}
                        length={listCrud?.dataList(objectData)?.length}
                    />
                );
            },
        },
    ],
};

export const ContentCrudList = ({ listCrud, objectData, ...props }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(userProfileSelector);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [available, setAvailable] = useState(null);

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

    useEffect(() => {
        if (!objectData?.loading && !listCrud?.dataList(objectData) && !objectData?.error) {
            dispatch(listCrud?.loadDataAction());
        }
    }, []);

    useEffect(() => {
        if (!objectData?.contentType) {
            setAvailable(null);
            return;
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.contentsApi.getAvailable(objectData?.contentType.id);
            if (!result?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                setAvailable(null);
                return;
            }

            setAvailable({
                number: objectData.contentType.maxObjectNb ? objectData.contentType.maxObjectNb - result.number : 1,
                createdNumber: result.number,
                maxNumber: objectData.contentType.maxObjectNb,
            });
        });
    }, [objectData?.contentType]);

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
            <Component.CmtPageWrapper title={`${listCrud?.title} (${objectData.contentType.name})` || ''}>
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

                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
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
                                <Box className="flex align-center margin-left-auto">
                                    {available?.number <= 0 && (
                                        <Tooltip placement="top" title="Vous avez atteint le nombre de contenus que vous pouvez créer avec ce type de contenu.">
                                            <WarningIcon color="warning" sx={{ mr: 5 }} />
                                        </Tooltip>
                                    )}

                                    {accessUserCreate && (listCrud?.new || listCrud?.links?.new) && (
                                        <Component.CreateButton
                                            variant="contained"
                                            onClick={() => (listCrud?.new ? listCrud?.new({ listCrud, ...props }) : navigate(listCrud.links.new()))}
                                            disabled={Boolean(available?.number <= 0)}
                                        >
                                            Nouveau
                                        </Component.CreateButton>
                                    )}
                                </Box>
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
                            {...props}
                        />
                    );
                })}
            </Component.CmtPageWrapper>

            {listCrud?.deleteComponent ? (
                <listCrud.deleteComponent deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} handleDelete={handleDelete} {...props} />
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
