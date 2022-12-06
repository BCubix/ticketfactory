import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from '@mui/system';
import {
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getThemesAction, themesSelector } from '@Redux/themes/themesSlice';
import { apiMiddleware } from "@Services/utils/apiMiddleware";

export const ThemesList = () => {
    const { loading, themes, error } = useSelector(themesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createDialog, setCreateDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [themeId, setThemeId] = useState(null);

    useEffect(() => {
        if (!loading && !themes && !error) {
            dispatch(getThemesAction());
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.parametersApi.getParametersByKey('main_theme');
            if (!result.result || !result.parameters) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.THEMES_BASE_PATH);

                return;
            }

            setThemeId(parseInt(result.parameters[0].paramValue));
        });
    }, []);

    const handleSubmit = () => {
        setCreateDialog(false);
        dispatch(getThemesAction());
        NotificationManager.success('Votre thème a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
        setTimeout(() => window.location.reload(), 1000);
    }

    const handleSelect = async (name) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.themesApi.activeTheme(name);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.THEMES_BASE_PATH);

                return;
            }

            dispatch(getThemesAction());
            NotificationManager.success('Le thème choisi est devenue le thème principal.', 'Succès', Constant.REDIRECTION_TIME);
            setTimeout(() => window.location.reload(), 1000);
        });
    }

    const handleDelete = async (name) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.themesApi.deleteTheme(name);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.THEMES_BASE_PATH);

                return;
            }

            dispatch(getThemesAction());
            setDeleteDialog(null);
            setTimeout(() => window.location.reload(), 1000);
        });
    }

    if (!themes) {
        return <></>;
    }

    return (
        <>
            <Component.CmtPageWrapper title={'Themes'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des thèmes
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                                Upload
                            </Component.CreateButton>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 5 }}>
                            {themes.map((theme, index) => (
                                <Component.CmtCard sx={{ width: 300, marginInline: 3 }} key={index}>
                                    <CardMedia
                                        component='img'
                                        alt='preview'
                                        height={250}
                                        image={theme.previewUrl}
                                        sx={{ objectFit: 'cover', objectPosition: 'top' }}
                                    />
                                    <CardHeader
                                        title={`${theme.name}`}
                                        subheader={`Par ${theme.author.name} (${theme.version})`}
                                    />
                                    <CardActions sx={{ display: 'flex', justifyContent: 'center'}}>
                                        {theme.id !== themeId && (
                                            (<Component.ActionFabButton
                                                sx={{ marginInline: 1 }}
                                                color="primary"
                                                size="small"
                                                aria-label="Selection"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelect(theme.name);
                                                }}
                                            >
                                                <CheckCircleIcon />
                                            </Component.ActionFabButton>)
                                        )}
                                        <Component.DeleteFabButton
                                            sx={{ marginInline: 1 }}
                                            color="error"
                                            size="small"
                                            aria-label="Supprimer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteDialog(theme.name);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </Component.DeleteFabButton>
                                    </CardActions>
                                </Component.CmtCard>
                            ))}
                        </Box>
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Dialog
                fullWidth
                maxWidth="md"
                open={createDialog}
                onClose={() => setCreateDialog(false)}
            >
                <DialogTitle sx={{ fontSize: 20 }}>Ajouter un zip</DialogTitle>
                <DialogContent>
                    <Component.UploadTheme handleSubmit={handleSubmit} />
                </DialogContent>
            </Dialog>
            <Component.DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography>Êtes-vous sûr de vouloir supprimer ce thème ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
}
