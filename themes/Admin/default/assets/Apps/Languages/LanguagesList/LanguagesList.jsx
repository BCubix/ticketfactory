import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';
import { Api } from '@/AdminService/Api';

import { getLanguagesAction, languagesSelector } from '@Redux/languages/languagesSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const LanguagesList = () => {
    const { loading, languages, error, total } = useSelector(languagesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !languages && !error) {
            dispatch(getLanguagesAction());
        }
    }, []);

    const handleDelete = async (id) => {
        apiMiddleware(dispatch, async () => {
            await Api.languagesApi.deleteLanguage(id);

            dispatch(getLanguagesAction());
            setDeleteDialog(null);
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title="Langues">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des langues ({total || '0'})
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => navigate(Constant.LANGUAGES_BASE_PATH + Constant.CREATE_PATH)}>
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.ListTable
                            table={TableColumn.LanguagesList}
                            list={languages}
                            onEdit={(id) => {
                                navigate(`${Constant.LANGUAGES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            disableDeleteFunction={(item) => {
                                return Boolean(item.isDefault);
                            }}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer cette langue ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
