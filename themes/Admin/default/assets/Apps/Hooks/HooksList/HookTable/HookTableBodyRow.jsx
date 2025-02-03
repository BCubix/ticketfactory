import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import DragHandleIcon from '@mui/icons-material/DragHandle';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import { Avatar, TableCell, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const HookTableBodyRow = ({ hookName, module, index, setDeleteDialog, accessUserDelete }) => {
    return (
        <Draggable key={index} draggableId={index.toString()} index={index} isCombineEnabled ignoreContainerClipping>
            {(provided, snapshot) => (
                <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                    <TableCell className="hook-table-drag-cell">
                        <Box className="hook-table-drag-icon" {...provided.dragHandleProps}>
                            <DragHandleIcon sx={{ color: (theme) => theme.palette.crud.action.textColor }} />
                        </Box>
                    </TableCell>
                    <TableCell className="hook-table-index">
                        <Typography>{index + 1}</Typography>
                    </TableCell>
                    <TableCell className="hook-table-logo">
                        <Avatar src={module.logoUrl} />
                    </TableCell>
                    <TableCell className="hook-table-name">
                        <Typography>{module.displayName}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" fontSize={13}>
                            {`v${module.version}`}
                        </Typography>
                    </TableCell>
                    <TableCell className="hook-table-description">
                        <Typography>{module.description}</Typography>
                    </TableCell>
                    {accessUserDelete && (
                        <TableCell className="hook-table-button">
                            <Component.ActionFabButton
                                sx={{ marginInline: 1 }}
                                color="primary"
                                size="small"
                                aria-label="Action"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteDialog([hookName, module.name]);
                                }}
                            >
                                <UnpublishedIcon />
                            </Component.ActionFabButton>
                        </TableCell>
                    )}
                </TableRow>
            )}
        </Draggable>
    );
};
