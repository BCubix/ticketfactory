import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { redirectionsSelector } from '@Redux/redirections/redirectionsSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import redirectionsApi from '../../../services/api/redirectionsApi';
import { getRedirectionsAction } from '../../../redux/redirections/redirectionsSlice';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { CREATE_PATH, EDIT_PATH, REDIRECTIONS_BASE_PATH } from '../../../Constant';
import { ListTable } from '@Components/ListTable/ListTable';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID' },
    { name: 'active', label: 'Activé ?', type: 'bool' },
    { name: 'redirectType', label: 'Type de redirection' },
    { name: 'redirectFrom', label: 'Redirigé depuis' },
    { name: 'redirectTo', label: 'Redirigé vers' },
];

export const RedirectionsList = () => {
    const { loading, redirections, error } = useSelector(redirectionsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !redirections && !error) {
            dispatch(getRedirectionsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await redirectionsApi.deleteRedirection(id);

        dispatch(getRedirectionsAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <CmtPageWrapper title="Redirections">
                <Card sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Redirections ({redirections?.length})
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate(REDIRECTIONS_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </Button>
                        </Box>

                        <ListTable
                            table={TABLE_COLUMN}
                            list={redirections}
                            onEdit={(id) => {
                                navigate(`${REDIRECTIONS_BASE_PATH}/${id}${EDIT_PATH}`);
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
                        Êtes-vous sûr de vouloir supprimer cette redirection ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};