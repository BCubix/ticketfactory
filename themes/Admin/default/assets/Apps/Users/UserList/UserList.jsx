import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { changeUsersFilters, getUsersAction, usersSelector } from '@Redux/users/usersSlice';

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
        await Api.usersApi.deleteUser(id);

        dispatch(getUsersAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title={'Utilisateurs'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5">
                                Liste des utilisateurs {users && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + users.length} sur ${total})`}
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => navigate(Constant.USER_BASE_PATH + Constant.CREATE_PATH)}>
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.UserFilters filters={filters} changeFilters={(values) => dispatch(changeUsersFilters(values))} />

                        <Component.ListTable
                            table={TableColumn.UserList}
                            list={users}
                            onEdit={(id) => {
                                navigate(`${Constant.USER_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeUsersFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeUsersFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeUsersFilters({ ...filters, limit: newValue }));
                            }}
                            length={users?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
