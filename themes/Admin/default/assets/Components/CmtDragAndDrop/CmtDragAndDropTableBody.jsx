import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { TableBody } from "@mui/material";

export const CmtDragAndDropTableBody = ({ droppableId, onDragEnd, children }) => {
    if (!onDragEnd) {
        return <TableBody>{children}</TableBody>;
    }

    return (
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            <Droppable
                droppableId={droppableId}
                isCombineEnabled
                ignoreContainerClipping
            >
                {(provided, snapshot) => (
                    <TableBody
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        {children}
                        {provided.placeholder}
                    </TableBody>
                )}
            </Droppable>
        </DragDropContext>
    );
};