import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { Component } from '@/AdminService/Component';

export const HookTableBody = ({ hookName, modules, setDeleteDialog, handleDragEnd, ...rest }) => {
    return (
        <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
            <Droppable droppableId={hookName} isCombineEnabled ignoreContainerClipping>
                {(provided, snapshot) => (
                    <Component.TBody {...provided.droppableProps} ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                        {modules.map((module, index) => (
                            <Component.HookTableBodyRow hookName={hookName} module={module} index={index} setDeleteDialog={setDeleteDialog} key={index} {...rest} />
                        ))}
                        {provided.placeholder}
                    </Component.TBody>
                )}
            </Droppable>
        </DragDropContext>
    );
};
