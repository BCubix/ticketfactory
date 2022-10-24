import { CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { changeUsersFilters } from '../../../redux/users/usersSlice';
import { UserFilters } from './UserFilters/UserFilters';
import { CmtPagination } from '../../../Components/CmtPagination/CmtPagination';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%', sortable: true },
    { name: 'firstName', label: 'Prénom', width: '15%', sortable: true },
    { name: 'lastName', label: 'Nom', width: '15%', sortable: true },
    { name: 'email', label: 'Adresse Email', width: '30%', sortable: true },
    { name: 'roles', label: 'Rôle', width: '20%', sortable: true },
];
export const UserList = () => {
    const { loading, users, filters, total, error } = useSelector(usersSelector);
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
                                Liste des utilisateurs{' '}
                                {users &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + users.length
                                    } sur ${total})`}
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(USER_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>

                        <UserFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeUsersFilters(values))}
                        />

                        <ListTable
                            table={TABLE_COLUMN}
                            list={users}
                            onEdit={(id) => {
                                navigate(`${USER_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeUsersFilters(newFilters))}
                        />

                        <CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeUsersFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changeUsersFilters({ ...filters, limit: newValue }));
                            }}
                            length={users?.length}
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
