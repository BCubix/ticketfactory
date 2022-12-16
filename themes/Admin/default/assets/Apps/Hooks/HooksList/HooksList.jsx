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

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        let hookName = result.destination.droppableId;
        let indexSrc = result.source.index;
        let indexDest = result.destination.index;

        apiMiddleware(dispatch, async () => {
            const result = await Api.hooksApi.updateHookModules(hookName, indexSrc, indexDest);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            } else {
                dispatch(getHooksAction());
            }
        });
    };

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
            <Component.CmtPageWrapper title={'Hooks'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des hooks
                            </Typography>
                            <Component.CreateButton
                                variant="contained"
                                onClick={() => navigate(Constant.HOOKS_BASE_PATH + Constant.CREATE_PATH)}
                            >
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        {hooks.map(({ name, modules }, indexHook) => (
                            <>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650, marginTop: 10 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ width: '5%' }}>
                                                    {name}
                                                </TableCell>
                                                <TableCell sx={{ width: '5%' }}>
                                                </TableCell>
                                                <TableCell sx={{ width: '10%' }}>
                                                </TableCell>
                                                <TableCell sx={{ width: '5%' }}>
                                                </TableCell>
                                                <TableCell sx={{ width: '10%' }}>
                                                </TableCell>
                                                <TableCell sx={{ width: '55%' }}>
                                                </TableCell>
                                                <TableCell sx={{ width: '10%' }}>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
                                            <Droppable
                                                droppableId={name}
                                                isCombineEnabled
                                                ignoreContainerClipping
                                            >
                                                {(provided, snapshot) => (
                                                    <TableBody
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        isDraggingOver={snapshot.isDraggingOver}
                                                    >
                                                        {modules.map((module, index) => (
                                                            <Draggable
                                                                key={index}
                                                                draggableId={index.toString()}
                                                                index={index}
                                                                isCombineEnabled
                                                                ignoreContainerClipping
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <TableRow
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        isDragging={snapshot.isDragging}
                                                                    >
                                                                        <TableCell>
                                                                            <Box
                                                                                height="100%"
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    height: 30,
                                                                                    width: 30,
                                                                                    borderRadius: 1,
                                                                                    cursor: 'pointer',
                                                                                    border: (theme) => `1px solid ${theme.palette.crud.action.textColor}`,
                                                                                }}
                                                                                {...provided.dragHandleProps}
                                                                            >
                                                                                <MoreHorizIcon sx={{ color: (theme) => theme.palette.crud.action.textColor }} />
                                                                            </Box>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Avatar src={module.logoUrl}/>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography>{module.displayName}</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography>{module.version}</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography>{module.author}</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography>{module.description}</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Component.ActionFabButton
                                                                                sx={{ marginInline: 1 }}
                                                                                color="primary"
                                                                                size="small"
                                                                                aria-label="Action"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setDeleteDialog([name, module.name]);
                                                                                }}
                                                                            >
                                                                                <UnpublishedIcon />
                                                                            </Component.ActionFabButton>                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </TableBody>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </Table>
                                </TableContainer>
                            </>
                        ))}
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
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
