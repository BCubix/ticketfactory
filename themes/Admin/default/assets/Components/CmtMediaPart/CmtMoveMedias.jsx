import React from 'react';

import { Component } from '@/AdminService/Component';
import { Box } from '@mui/system';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export const CmtMoveMedias = ({ medias, setFieldValue, name }) => {
    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        let draggableId = result.source.index;
        let destId = result.destination.index;

        let newList = medias;
        let removedElement = medias.splice(draggableId, 1)[0];
        newList.splice(destId, 0, removedElement);

        newList.forEach((_, index) => {
            newList[index].position = index + 1;
        });

        setFieldValue(name, newList);
    };

    return (
        <Component.CmtFormBlock title={'Médias'}>
            <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
                <Droppable direction="horizontal" droppableId="columns" type="columns" isCombineEnabled ignoreContainerClipping>
                    {(provided, snapshot) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef} sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                            {medias.map((item, index) => {
                                return (
                                    <Draggable key={`media.${index}`} draggableId={`media.${index}`} index={index}>
                                        {(provided2, snapshot2) => (
                                            <Component.CmtMediaElement
                                                key={index}
                                                sx={{
                                                    position: 'relative',
                                                }}
                                                className="eventMediaElement"
                                                ref={provided2.innerRef}
                                                {...provided2.draggableProps}
                                                {...provided2.dragHandleProps}
                                            >
                                                <Component.CmtDisplayMediaType media={item.media} width={'100%'} height={'auto'} className="eventMediaType" />
                                            </Component.CmtMediaElement>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Component.CmtFormBlock>
    );
};
