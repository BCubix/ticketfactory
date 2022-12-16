import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";

import { TableBody } from "@mui/material";

import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { Api } from "@/AdminService/Api";

import { getHooksAction } from "@Redux/hooks/hooksSlice";
import { apiMiddleware } from "@Services/utils/apiMiddleware";

export const HookTableBody = ({hookName, modules, setDeleteDialog}) => {
    const dispatch = useDispatch();

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

    return (
        <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
            <Droppable
                droppableId={hookName}
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
                            <Component.HookTableBodyRow
                                name={hookName}
                                module={module}
                                index={index}
                                setDeleteDialog={setDeleteDialog}
                                key={index}
                            />
                        ))}
                        {provided.placeholder}
                    </TableBody>
                )}
            </Droppable>
        </DragDropContext>
    );
};