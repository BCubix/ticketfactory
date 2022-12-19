import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import UnpublishedIcon from "@mui/icons-material/Unpublished";
import { Box } from '@mui/system';
import {
    Avatar,
    CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography
} from '@mui/material';

import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { Api } from "@/AdminService/Api";

import { getHooksAction, hooksSelector } from '@Redux/hooks/hooksSlice';
import { apiMiddleware } from "@Services/utils/apiMiddleware";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export const HooksList = () => {
    const { loading, hooks, error } = useSelector(hooksSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !hooks && !error) {
            dispatch(getHooksAction());
        }
    }, []);
    const handleDisable = async (hookName, moduleName) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.hooksApi.disableModule(hookName, moduleName);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            } else {
                NotificationManager.success(
                    'Le hook du module a bien été désactivé.',
                    'Succès',
                    Constant.REDIRECTION_TIME
                );

                dispatch(getHooksAction());
            }
            setDeleteDialog(null);
        });
    }

    if (!hooks) {
        return <></>;
    }

    return (
        <>
            <Component.PageWrapper>
                <Box display="flex" justifyContent="space-between">
                    <Component.CmtPageTitle>Hooks</Component.CmtPageTitle>
                    <Component.CreateButton
                        variant="contained"
                        onClick={() => navigate(Constant.HOOKS_BASE_PATH + Constant.CREATE_PATH)}
                    >
                        Nouveau
                    </Component.CreateButton>
                </Box>
                {hooks.map(({ name, modules }, indexHook) => (
                    <Component.HookTable
                        hookName={name}
                        modules={modules}
                        setDeleteDialog={setDeleteDialog}
                        key={indexHook}
                    />
                ))}
            </Component.PageWrapper>
            <Component.DeleteDialog
                open={deleteDialog !== null}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDisable(...deleteDialog)}
                deleteText="Désactiver"
            >
                <Box textAlign="center" py={3}>
                    <Typography>Êtes-vous sûr de vouloir désactiver ce hook ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
}
