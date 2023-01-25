import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { changeEventsFilters, eventsSelector, getEventsAction } from '@Redux/events/eventsSlice';
import { loginFailure } from '@Redux/profile/profileSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const EventsList = () => {
    const { loading, events, filters, total, error } = useSelector(eventsSelector);
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !events && !error) {
            dispatch(getEventsAction());
        }

        apiMiddleware(dispatch, async () => {
            const categories = await Api.categoriesApi.getCategories();
            if (categories.result) {
                setCategories(categories?.categories);
            }
        });
    }, []);

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.eventsApi.deleteEvent(id);

        dispatch(getEventsAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.eventsApi.duplicateEvent(id);

            if (result?.result) {
                NotificationManager.success("L'évènement a bien été dupliqué.", 'Succès', Constant.REDIRECTION_TIME);

                dispatch(getEventsAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title={'Evènements'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5">
                                Liste des évènements {events && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + events.length} sur ${total})`}
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => navigate(Constant.EVENTS_BASE_PATH + Constant.CREATE_PATH)}>
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.EventsFilters filters={filters} changeFilters={(values) => dispatch(changeEventsFilters(values))} categoriesList={categories} />

                        <Component.ListTable
                            filters={filters}
                            contextualMenu
                            table={TableColumn.EventsList}
                            list={events}
                            onEdit={(id) => {
                                navigate(`${Constant.EVENTS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onTranslate={(id, languageId) => {
                                navigate(`${Constant.EVENTS_BASE_PATH}${Constant.CREATE_PATH}?eventId=${id}&languageId=${languageId}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            changeFilters={(newFilters) => dispatch(changeEventsFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeEventsFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeEventsFilters({ ...filters, limit: newValue }));
                            }}
                            length={events?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer cet évènement ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
