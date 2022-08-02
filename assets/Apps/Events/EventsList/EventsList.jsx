import { eventsSelector } from '@Redux/events/eventsSlice';
import { Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitle } from '@Components/Page/PageTitle/PageTitle';
import { PageWrapper } from '@Components/Page/PageWrapper/sc.PageWrapper';
import { getEventsAction } from '@Redux/events/eventsSlice';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import eventsApi from '@Services/api/eventsApi';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { useState } from 'react';
import { CREATE_PATH, EVENTS_BASE_PATH, EDIT_PATH } from '../../../Constant';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID' },
    { name: 'firstName', label: 'Prénom' },
    { name: 'lastName', label: 'Nom' },
    { name: 'email', label: 'Adresse Email' },
];

export const EventsList = () => {
    const { loading, events, error } = useSelector(eventsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !events && !error) {
            dispatch(getEventsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await eventsApi.deleteEvent(id);

        dispatch(getEventsAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <PageWrapper>
                <PageTitle>Evènements</PageTitle>
                <Card sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Evènements ({events?.length})
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate(EVENTS_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </Button>
                        </Box>

                        <ListTable
                            table={TABLE_COLUMN}
                            list={events}
                            onEdit={(id) => {
                                navigate(`${EVENTS_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                        />
                    </CardContent>
                </Card>
            </PageWrapper>
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
