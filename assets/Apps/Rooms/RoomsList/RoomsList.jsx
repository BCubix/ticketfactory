import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CardContent, Typography } from '@mui/material';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { TableColumn } from "@/AdminService/TableColumn";

import { loginFailure } from '@Redux/profile/profileSlice';
import { changeRoomsFilters, getRoomsAction, roomsSelector } from '@Redux/rooms/roomsSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const RoomsList = () => {
    const { loading, rooms, filters, total, error } = useSelector(roomsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !rooms && !error) {
            dispatch(getRoomsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.roomsApi.deleteRoom(id);

        dispatch(getRoomsAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.roomsApi.duplicateRoom(id);

            if (result?.result) {
                NotificationManager.success(
                    'La salle a bien été dupliquée.',
                    'Succès',
                    Constant.REDIRECTION_TIME
                );

                dispatch(getRoomsAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title="Salles">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des salles{' '}
                                {rooms &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + rooms.length
                                    } sur ${total})`}
                            </Typography>
                            <Component.CreateButton
                                variant="contained"
                                onClick={() => navigate(Constant.ROOMS_BASE_PATH + Constant.CREATE_PATH)}
                            >
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.RoomsFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeRoomsFilters(values))}
                        />

                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.RoomsList}
                            list={rooms}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onEdit={(id) => {
                                navigate(`${Constant.ROOMS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeRoomsFilters(newFilters))}
                            onDelete={(id) => setDeleteDialog(id)}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeRoomsFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changeRoomsFilters({ ...filters, limit: newValue }));
                            }}
                            length={rooms?.length}
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
                        Êtes-vous sûr de vouloir supprimer cette salle ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
