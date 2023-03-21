import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { TableCell, TableRow } from '@mui/material';
import { Box } from '@mui/system';

export const CmtDragAndDropTableBodyRow = ({ onDragEnd, index, setExpendElementTranslation, tableRowProps, children }) => {
    if (!onDragEnd) {
        return <TableRow {...tableRowProps}>{children}</TableRow>;
    }

    if (onDragEnd === true) {
        return (
            <TableRow {...tableRowProps}>
                <TableCell sx={{ width: '1%' }} />
                {children}
            </TableRow>
        );
    }

    return (
        <Draggable key={index} draggableId={index.toString()} index={index} isCombineEnabled ignoreContainerClipping>
            {(provided, snapshot) => (
                <TableRow
                    {...tableRowProps}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    isDragging={(() => {
                        if (snapshot.isDragging) {
                            setExpendElementTranslation(null);
                        }
                        return snapshot.isDragging;
                    })()}
                >
                    <TableCell sx={{ width: '1%' }}>
                        <Box
                            height="100%"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 30,
                                width: 30,
                                cursor: 'pointer',
                            }}
                            {...provided.dragHandleProps}
                        >
                            <DragHandleIcon sx={{ color: (theme) => theme.palette.crud.action.textColor }} />
                        </Box>
                    </TableCell>
                    {children}
                </TableRow>
            )}
        </Draggable>
    );
};
