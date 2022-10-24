import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { Box, CardContent, Typography } from '@mui/material';
import { CONTACT_REQUEST_BASE_PATH, CREATE_PATH, EDIT_PATH } from '../../../Constant';
import { ListTable } from '@Components/ListTable/ListTable';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';
import {
    changeContactRequestsFilters,
    contactRequestsSelector,
    getContactRequestsAction,
} from '../../../redux/contactRequests/contactRequestsSlice';
import contactRequestsApi from '../../../services/api/contactRequestsApi';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { ContactRequestsFilters } from './ContactRequestsFilters/ContactRequestsFilters';
import { CmtPagination } from '../../../Components/CmtPagination/CmtPagination';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%', sortable: true },
    { name: 'active', label: 'Gérée ?', type: 'bool', width: '10%', sortable: true },
    { name: 'firstName', label: 'Prénom', width: '10%', sortable: true },
    { name: 'lastName', label: 'Nom', width: '10%', sortable: true },
    { name: 'phone', label: 'Téléphone', width: '20%', sortable: true },
    { name: 'email', label: 'Email', width: '20%', sortable: true },
    { name: 'subject', label: 'Objet', width: '10%', sortable: true },
];

export const ContactRequestsList = () => {
    const { loading, contactRequests, filters, total, error } =
        useSelector(contactRequestsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !contactRequests && !error) {
            dispatch(getContactRequestsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await contactRequestsApi.deleteContactRequest(id);

        dispatch(getContactRequestsAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <CmtPageWrapper title="Demandes de contact">
                <CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des demandes de contact{' '}
                                {contactRequests &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + contactRequests.length
                                    } sur ${total})`}
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(CONTACT_REQUEST_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>

                        <ContactRequestsFilters
                            filters={filters}
                            changeFilters={(values) =>
                                dispatch(changeContactRequestsFilters(values))
                            }
                        />
                        <ListTable
                            filters={filters}
                            table={TABLE_COLUMN}
                            list={contactRequests}
                            changeFilters={(newFilters) =>
                                dispatch(changeContactRequestsFilters(newFilters))
                            }
                            onEdit={(id) => {
                                navigate(`${CONTACT_REQUEST_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                        />

                        <CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeContactRequestsFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(
                                    changeContactRequestsFilters({ ...filters, limit: newValue })
                                );
                            }}
                            length={contactRequests?.length}
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
                        Êtes-vous sûr de vouloir supprimer cette demande de contact ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
