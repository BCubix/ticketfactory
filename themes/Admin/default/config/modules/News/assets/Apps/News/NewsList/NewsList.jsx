import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NotificationManager } from "react-notifications";

import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { TableColumn } from "@/AdminService/TableColumn";

import { loginFailure } from '@/redux/profile/profileSlice';
import { apiMiddleware } from "@/services/utils/apiMiddleware";

import { changeNewsesFilters, getNewsesAction, newsesSelector } from "../../../redux/news/newsesSlice";

export const NewsList = () => {
    const { loading, newses, error, filters, total } = useSelector(newsesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !newses && !error) {
            dispatch(getNewsesAction());
        }
    }, []);

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.newsesApi.duplicateNews(id);

            if (result?.result) {
                NotificationManager.success(
                    'L\'actualité a bien été dupliquée.',
                    'Succès',
                    Constant.REDIRECTION_TIME
                );

                dispatch(getNewsesAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.newsesApi.deleteNews(id);

        dispatch(getNewsesAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title={'News'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des actualités{' '}
                                {newses &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + newses.length
                                    } sur ${total})`}
                            </Typography>
                            <Component.CreateButton
                                variant="contained"
                                onClick={() => navigate(Constant.NEWS_BASE_PATH + Constant.CREATE_PATH)}
                            >
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.NewsFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeNewsesFilters(values))}
                        />

                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.NewsList}
                            list={newses}
                            onEdit={(id) => {
                                navigate(`${Constant.NEWS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) =>
                                dispatch(changeNewsesFilters(newFilters))
                            }
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeNewsesFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changeNewsesFilters({ ...filters, limit: newValue }));
                            }}
                            length={newses?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography>Êtes-vous sûr de vouloir supprimer cette actualité ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
}

export default { NewsList };
