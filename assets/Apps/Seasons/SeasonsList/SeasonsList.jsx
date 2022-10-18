import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { seasonsSelector } from '@Redux/seasons/seasonsSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import seasonsApi from '../../../services/api/seasonsApi';
import { getSeasonsAction } from '../../../redux/seasons/seasonsSlice';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { Box, CardContent, Typography } from '@mui/material';
import { CREATE_PATH, EDIT_PATH, REDIRECTION_TIME, SEASONS_BASE_PATH } from '../../../Constant';
import { ListTable } from '@Components/ListTable/ListTable';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { apiMiddleware } from '../../../services/utils/apiMiddleware';
import { NotificationManager } from 'react-notifications';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%' },
    { name: 'active', label: 'Activé ?', type: 'bool', width: '10%' },
    { name: 'name', label: 'Nom de la catégorie', width: '40%' },
    { name: 'beginYear', label: 'Année de début', width: '30%' },
];

export const SeasonsList = () => {
    const { loading, seasons, error } = useSelector(seasonsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !seasons && !error) {
            dispatch(getSeasonsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await seasonsApi.deleteSeason(id);

        dispatch(getSeasonsAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await seasonsApi.duplicateSeason(id);

            if (result?.result) {
                NotificationManager.success(
                    'La saison à bien été dupliqué.',
                    'Succès',
                    REDIRECTION_TIME
                );

                dispatch(getSeasonsAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <CmtPageWrapper title={'Saisons'}>
                <CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des saisons
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(SEASONS_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>

                        <ListTable
                            contextualMenu
                            table={TABLE_COLUMN}
                            list={seasons}
                            onEdit={(id) => {
                                navigate(`${SEASONS_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
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
