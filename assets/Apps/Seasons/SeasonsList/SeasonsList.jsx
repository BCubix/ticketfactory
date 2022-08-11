import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { seasonsSelector } from '@Redux/seasons/seasonsSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import seasonsApi from '../../../services/api/seasonsApi';
import { getSeasonsAction } from '../../../redux/seasons/seasonsSlice';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { CmtPageTitle } from '@Components/CmtPage/CmtPageTitle/CmtPageTitle';
import { CREATE_PATH, EDIT_PATH, SEASONS_BASE_PATH } from '../../../Constant';
import { ListTable } from '@Components/ListTable/ListTable';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID' },
    { name: 'active', label: 'Activé ?', type: 'bool' },
    { name: 'name', label: 'Nom de la catégorie' },
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

    return (
        <>
            <CmtPageWrapper>
                <CmtPageTitle>Saisons</CmtPageTitle>
                <Card sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Saisons ({seasons?.length})
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate(SEASONS_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </Button>
                        </Box>

                        <ListTable
                            table={TABLE_COLUMN}
                            list={seasons}
                            onEdit={(id) => {
                                navigate(`${SEASONS_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                        />
                    </CardContent>
                </Card>
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
