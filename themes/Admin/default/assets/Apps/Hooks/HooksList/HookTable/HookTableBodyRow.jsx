import React from "react";
import { Draggable } from "react-beautiful-dnd";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
                    <TableCell>
                        <Box
                            height="100%"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 30,
                                width: 30,
                                borderRadius: 1,
                                cursor: 'pointer',
                                border: (theme) => `1px solid ${theme.palette.crud.action.textColor}`,
                            }}
                            {...provided.dragHandleProps}
                        >
                            <MoreHorizIcon sx={{ color: (theme) => theme.palette.crud.action.textColor }} />
                        </Box>
                    </TableCell>
                    <TableCell>
                        <Avatar src={module.logoUrl}/>
                    </TableCell>
                    <TableCell>
                        <Typography>{module.displayName}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{module.version}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{module.author}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{module.description}</Typography>
                    </TableCell>
                    <TableCell>
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