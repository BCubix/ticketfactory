import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/system';
import { Button, Card, CardContent, Typography } from '@mui/material';

import { CREATE_PATH, EDIT_PATH, PAGES_BASE_PATH } from '@/Constant';

import authApi from '@Services/api/authApi';
import pagesApi from '@Services/api/pagesApi';
import { loginFailure } from '@Redux/profile/profileSlice';
import { getPagesAction, pagesSelector } from '@Redux/pages/pagesSlice';

import { ListTable } from '@Components/ListTable/ListTable';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { apiMiddleware } from '../../../services/utils/apiMiddleware';
import { NotificationManager } from 'react-notifications';
import { REDIRECTION_TIME } from '../../../Constant';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%' },
    { name: 'active', label: 'Activé ?', type: 'bool', width: '10%' },
    { name: 'title', label: 'Titre de la page', width: '70%' },
];

function PagesList() {
    const { loading, pages, error } = useSelector(pagesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !pages && !error) {
            dispatch(getPagesAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await pagesApi.deletePage(id);

        dispatch(getPagesAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await pagesApi.duplicatePage(id);

            if (result?.result) {
                NotificationManager.success(
                    'La page à bien été dupliqué.',
                    'Succès',
                    REDIRECTION_TIME
                );

                dispatch(getPagesAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <CmtPageWrapper title={'Pages'}>
                <CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des pages
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(PAGES_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>
                        <ListTable
                            contextualMenu
                            table={TABLE_COLUMN}
                            list={pages}
                            onEdit={(id) => {
                                navigate(`${PAGES_BASE_PATH}/${id}${EDIT_PATH}`);
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
                    <Typography>Êtes-vous sûr de vouloir supprimer cette page ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
}

export default PagesList;
