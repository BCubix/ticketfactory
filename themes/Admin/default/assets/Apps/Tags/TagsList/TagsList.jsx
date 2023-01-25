import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { changeTagsFilters, getTagsAction, tagsSelector } from '@Redux/tags/tagsSlice';

export const TagsList = () => {
    const { loading, tags, filters, total, error } = useSelector(tagsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !tags && !error) {
            dispatch(getTagsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await Api.tagsApi.deleteTag(id);

        dispatch(getTagsAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title="Tags">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5">
                                Liste des tags {tags && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + tags.length} sur ${total})`}
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => navigate(Constant.TAGS_BASE_PATH + Constant.CREATE_PATH)}>
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.TagsFilters filters={filters} changeFilters={(values) => dispatch(changeTagsFilters(values))} />

                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.TagsList}
                            list={tags}
                            onEdit={(id) => {
                                navigate(`${Constant.TAGS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onTranslate={(id, languageId) => {
                                navigate(`${Constant.TAGS_BASE_PATH}${Constant.CREATE_PATH}?tagId=${id}&languageId=${languageId}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeTagsFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeTagsFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeTagsFilters({ ...filters, limit: newValue }));
                            }}
                            length={tags?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer ce tag ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
