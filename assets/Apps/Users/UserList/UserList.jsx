import { Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CmtPageTitle } from '@Components/CmtPage/CmtPageTitle/CmtPageTitle';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { usersSelector } from '@Redux/users/usersSlice';
import { getUsersAction } from '@Redux/users/usersSlice';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { CREATE_PATH, EDIT_PATH, USER_BASE_PATH } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import usersApi from '../../../services/api/usersApi';
import { DeleteDialog } from '../../../Components/DeleteDialog/DeleteDialog';
import { useState } from 'react';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%' },
    { name: 'firstName', label: 'Prénom', width: '20%' },
    { name: 'lastName', label: 'Nom', width: '20%' },
    { name: 'email', label: 'Adresse Email', width: '40%' },
];
export const UserList = () => {
    const { loading, users, error } = useSelector(usersSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !users && !error) {
            dispatch(getUsersAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await usersApi.deleteUser(id);

        dispatch(getUsersAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <CmtPageWrapper title={'Utilisateurs'}>
                <CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des utilisateurs
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(USER_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>

                        <ListTable
                            table={TABLE_COLUMN}
                            list={users}
                            onEdit={(id) => {
                                navigate(`${USER_BASE_PATH}/${id}${EDIT_PATH}`);
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
                        Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
