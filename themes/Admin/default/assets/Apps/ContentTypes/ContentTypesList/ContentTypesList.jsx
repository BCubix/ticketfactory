import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { TableColumn } from "@/AdminService/TableColumn";

import {
    changeContentTypesFilters,
    contentTypesSelector,
    getContentTypesAction
} from '@Redux/contentTypes/contentTypesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const ContentTypesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, contentTypes, filters, total, error } = useSelector(contentTypesSelector);
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !contentTypes && !error) {
            dispatch(getContentTypesAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.contentTypesApi.deleteContentType(id);

        dispatch(getContentTypesAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title="Types de contenus">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des types de contenus{' '}
                                {contentTypes &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + contentTypes.length
                                    } sur ${total})`}
                            </Typography>
                            <Component.CreateButton
                                variant="contained"
                                onClick={() => navigate(Constant.CONTENT_TYPES_BASE_PATH + Constant.CREATE_PATH)}
                            >
                                Nouveau
                            </Component.CreateButton>
                        </Box>
                        <Component.ContentTypesFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeContentTypesFilters(values))}
                        />

                        <Component.ListTable
                            filters={filters}
                            table={TableColumn.ContentTypesList}
                            list={contentTypes}
                            onEdit={(id) => {
                                navigate(`${Constant.CONTENT_TYPES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            changeFilters={(newFilters) =>
                                dispatch(changeContentTypesFilters(newFilters))
                            }
                            onDelete={(id) => setDeleteDialog(id)}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeContentTypesFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(
                                    changeContentTypesFilters({ ...filters, limit: newValue })
                                );
                            }}
                            length={contentTypes?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">
                        Êtes-vous sûr de vouloir supprimer ce type de contenus ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
