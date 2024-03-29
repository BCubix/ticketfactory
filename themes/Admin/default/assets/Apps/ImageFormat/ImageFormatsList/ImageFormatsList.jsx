import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CardContent, Dialog, DialogContent, DialogTitle, LinearProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { changeImageFormatsFilters, getImageFormatsAction, imageFormatsSelector } from '@Redux/imageFormats/imageFormatSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const ImageFormatsList = () => {
    const { loading, imageFormats, filters, total, error } = useSelector(imageFormatsSelector);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !imageFormats && !error) {
            dispatch(getImageFormatsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await Api.imageFormatsApi.deleteImageFormat(id);

        dispatch(getImageFormatsAction());

        setDeleteDialog(null);
    };

    if (null === imageFormats) {
        return <></>;
    }

    return (
        <>
            <Component.CmtPageWrapper title="Formats D'image">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des formats d'image{' '}
                                    {imageFormats && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + imageFormats.length} sur ${total})`}
                                </Typography>
                                <Component.CreateButton variant="contained" onClick={() => navigate(Constant.IMAGE_FORMATS_BASE_PATH + Constant.CREATE_PATH)}>
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.ImageFormatsFilters filters={filters} changeFilters={(values) => dispatch(changeImageFormatsFilters(values))} />

                        <Component.ListTable
                            table={TableColumn.ImageFormatsList}
                            list={imageFormats}
                            onEdit={(id) => {
                                navigate(`${Constant.IMAGE_FORMATS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeImageFormatsFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeImageFormatsFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeImageFormatsFilters({ ...filters, limit: newValue }));
                            }}
                            length={imageFormats?.length}
                        />
                    </CardContent>
                </Component.CmtCard>

                <Component.ImageFormatParameters />
                <Component.ImageFormatGenerate />
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer ce format d'image ?</Typography>
                    <Typography component="p">Les miniatures seront supprimées.</Typography>
                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
