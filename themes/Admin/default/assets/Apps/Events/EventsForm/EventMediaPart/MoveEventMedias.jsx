import React from 'react';
import { Box } from '@mui/system';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { getMediaType } from '@Services/utils/getMediaType';

export const MoveEventMedias = ({ eventMedias, setFieldValue }) => {
    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        let draggableId = result.source.index;
        let destId = result.destination.index;

        let newList = eventMedias;
        let removedElement = eventMedias.splice(draggableId, 1)[0];
        newList.splice(destId, 0, removedElement);

        newList.forEach((_, index) => {
            newList[index].position = index + 1;
        });

        setFieldValue('eventMedias', newList);
    };

    return (
        <Component.CmtFormBlock title={'Médias'}>
            <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
                <Droppable direction="horizontal" droppableId="columns" type="columns" isCombineEnabled ignoreContainerClipping>
                    {(provided, snapshot) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef} sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                            {eventMedias.map((item, index) => {
                                return (
                                    <Draggable key={`media.${index}`} draggableId={`media.${index}`} index={index}>
                                        {(provided2, snapshot2) => (
                                            <Component.CmtMediaElement
                                                key={index}
                                                sx={{
                                                    position: 'relative',
                                                    flexDirection: 'column',
                                                }}
                                                className="eventMediaElement"
                                                ref={provided2.innerRef}
                                                {...provided2.draggableProps}
                                                {...provided2.dragHandleProps}
                                            >
                                                <Component.CmtDisplayMediaType media={item.media} width={'100%'} height={'auto'} className="eventMediaType" />
                                                <Typography className="media_type_label">{getMediaType(item.media.documentType)}</Typography>
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
