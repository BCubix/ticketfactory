import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box } from '@mui/system';
import {
    CardContent,
    Typography
} from '@mui/material';

import { Component } from "@/AdminService/Component";

import { getHooksAction, hooksSelector } from '@Redux/hooks/hooksSlice';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export const HooksList = () => {
    const { loading, hooks, error } = useSelector(hooksSelector);
    const dispatch = useDispatch();

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
        let indexSrc = Number(result.draggableId);
        let indexDest = result.destination.index;

        const hookIndex = hooks.findIndex(hook => hook.name === hookName);

        const tmp = hooks[hookIndex][indexDest];
        hooks[hookIndex]['modules'][indexDest] = hooks[hookIndex][indexSrc];
        hooks[hookIndex]['modules'][indexSrc] = tmp;
    };

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
                        </Box>

                        {hooks.map(({ name, modules }, indexHook) => (
                            <Box key={indexHook}>
                                <Typography>{name}</Typography>
                                <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
                                    <Droppable
                                        droppableId={name}
                                        isCombineEnabled
                                        ignoreContainerClipping
                                    >
                                        {(provided, snapshot) => (
                                            <Component.DroppableBox
                                                id={name}
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                sx={{
                                                    paddingTop: 0,
                                                    paddingBottom: 10,
                                                    margin: 0,
                                                    paddingInline: 0,
                                                }}
                                            >
                                                {modules.map((module, index) => (
                                                    <Draggable
                                                        key={index}
                                                        draggableId={index.toString()}
                                                        index={index}
                                                    >
                                                        {(provided2, snapshot2) => (
                                                            <Component.RenderElement provided={provided2} snapshot={snapshot2}>
                                                                <Typography>{module.name}</Typography>
                                                            </Component.RenderElement>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </Component.DroppableBox>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Box>
                        ))}
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
        </>
    );
}
