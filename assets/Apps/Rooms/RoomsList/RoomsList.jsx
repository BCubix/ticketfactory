import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { roomsSelector } from '@Redux/rooms/roomsSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import roomsApi from '../../../services/api/roomsApi';
import { getRoomsAction } from '../../../redux/rooms/roomsSlice';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { Box, CardContent, Typography } from '@mui/material';
import { CREATE_PATH, EDIT_PATH, REDIRECTION_TIME, ROOMS_BASE_PATH } from '../../../Constant';
import { ListTable } from '@Components/ListTable/ListTable';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { apiMiddleware } from '../../../services/utils/apiMiddleware';
import { NotificationManager } from 'react-notifications';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%' },
    { name: 'active', label: 'Activé ?', type: 'bool', width: '10%' },
    { name: 'name', label: 'Nom de la catégorie', width: '30%' },
    { name: 'seatsNb', label: 'Nombre de places', width: '20%' },
    { name: 'area', label: 'Superficie', width: '20%' },
];

export const RoomsList = () => {
    const { loading, rooms, error } = useSelector(roomsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !rooms && !error) {
            dispatch(getRoomsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await roomsApi.deleteRoom(id);

        dispatch(getRoomsAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await roomsApi.duplicateRoom(id);

            if (result?.result) {
                NotificationManager.success(
                    'La salle à bien été dupliqué.',
                    'Succès',
                    REDIRECTION_TIME
                );

                dispatch(getRoomsAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <CmtPageWrapper title="Salles">
                <CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des salles
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(ROOMS_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>

                        <ListTable
                            contextualMenu
                            table={TABLE_COLUMN}
                            list={rooms}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onEdit={(id) => {
                                navigate(`${ROOMS_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                        />
                    </CardContent>
                </CmtCard>
            </CmtPageWrapper>
            <DeleteDialog
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
            </DeleteDialog>
        </>
    );
};
