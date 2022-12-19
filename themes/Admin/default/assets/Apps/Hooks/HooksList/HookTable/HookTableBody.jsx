import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { TableBody } from "@mui/material";

import { Component } from "@/AdminService/Component";

export const HookTableBody = ({ hookName, modules, setDeleteDialog, handleDragEnd }) => {
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
                                hookName={hookName}
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