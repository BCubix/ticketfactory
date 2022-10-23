import { eventsSelector } from '@Redux/events/eventsSlice';
import { CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { getEventsAction } from '@Redux/events/eventsSlice';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import eventsApi from '@Services/api/eventsApi';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { useState } from 'react';
import { CREATE_PATH, EVENTS_BASE_PATH, EDIT_PATH, REDIRECTION_TIME } from '../../../Constant';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { apiMiddleware } from '../../../services/utils/apiMiddleware';
import { NotificationManager } from 'react-notifications';
import { categoriesSelector, getCategoriesAction } from '../../../redux/categories/categoriesSlice';
import { EventsFilters } from './EventsFilters/EventsFilters';
import { changeEventsFilters } from '../../../redux/events/eventsSlice';
import categoriesApi from '../../../services/api/categoriesApi';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%', sortable: true },
    { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
    { name: 'name', label: 'Nom', width: '20%', sortable: true },
    { name: 'mainCategory.name', label: 'Catégorie', width: '10%', sortable: true },
    { name: 'room.name', label: 'Salle', width: '10%', sortable: true },
    { name: 'season.name', label: 'Saison', width: '20%', sortable: true },
    { name: 'tags.0.name', label: 'Tags', width: '10%', sortable: true },
];

export const EventsList = () => {
    const { loading, events, filters, error } = useSelector(eventsSelector);
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !events && !error) {
            dispatch(getEventsAction());
        }

        apiMiddleware(dispatch, async () => {
            const categories = await categoriesApi.getCategories();
            if (categories.result) {
                setCategories(categories?.categories);
            }
        });
    }, []);

    const handleDelete = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await eventsApi.deleteEvent(id);

        dispatch(getEventsAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await eventsApi.duplicateEvent(id);

            if (result?.result) {
                NotificationManager.success(
                    "L'évènement à bien été dupliqué.",
                    'Succès',
                    REDIRECTION_TIME
                );

                dispatch(getEventsAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <CmtPageWrapper title={'Evènements'}>
                <CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des évènements
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(EVENTS_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>

                        <EventsFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeEventsFilters(values))}
                            categoriesList={categories}
                        />

                        <ListTable
                            filters={filters}
                            contextualMenu
                            table={TABLE_COLUMN}
                            list={events}
                            onEdit={(id) => {
                                navigate(`${EVENTS_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            changeFilters={(newFilters) =>
                                dispatch(changeEventsFilters(newFilters))
                            }
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
                        Êtes-vous sûr de vouloir supprimer cet évènement ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
