import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, CardContent, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { changeContactRequestsFilters, contactRequestsSelector, getContactRequestsAction } from '@Redux/contactRequests/contactRequestsSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const ContactRequestsList = () => {
    const { loading, contactRequests, filters, total, error } = useSelector(contactRequestsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !contactRequests && !error) {
            dispatch(getContactRequestsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.contactRequestsApi.deleteContactRequest(id);

        dispatch(getContactRequestsAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title="Demandes de contact">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5">
                                Liste des demandes de contact{' '}
                                {contactRequests && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + contactRequests.length} sur ${total})`}
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => navigate(Constant.CONTACT_REQUEST_BASE_PATH + Constant.CREATE_PATH)}>
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.ContactRequestsFilters filters={filters} changeFilters={(values) => dispatch(changeContactRequestsFilters(values))} />
                        <Component.ListTable
                            filters={filters}
                            table={TableColumn.ContactRequestsList}
                            list={contactRequests}
                            changeFilters={(newFilters) => dispatch(changeContactRequestsFilters(newFilters))}
                            onEdit={(id) => {
                                navigate(`${Constant.CONTACT_REQUEST_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeContactRequestsFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeContactRequestsFilters({ ...filters, limit: newValue }));
                            }}
                            length={contactRequests?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer cette demande de contact ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
