import React from "react";
import { Draggable } from "react-beautiful-dnd";

import DragHandleIcon from '@mui/icons-material/DragHandle';
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import { Avatar, TableCell, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { Component } from "@/AdminService/Component";

export const HookTableBodyRow = ({ hookName, module, index, setDeleteDialog }) => {
    return (
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
                    <TableCell sx={{ width: '3%' }}>
                        <Typography>
                            {index + 1}
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ width: '5%' }}>
                        <Avatar src={module.logoUrl}/>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>
                        <Typography>
                            {module.displayName}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" fontSize={13}>
                            {`v${module.version}`}
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ width: '70%' }}>
                        <Typography>{module.description}</Typography>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>
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
                </TableRow>
            )}
        </Draggable>
    );
};