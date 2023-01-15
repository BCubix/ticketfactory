import React from 'react';

import { TableCell } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import DeleteIcon from '@mui/icons-material/Delete';

import { Component } from '@/AdminService/Component';

export const ListTableCellButtons = ({ item, onDelete, onEdit, onRemove, onSelect, onActive, onDisable, disableDeleteFunction, contextualMenu, themeId, handleClick }) => {
    if (onDelete !== null || onEdit !== null || (onRemove !== null && onSelect !== null) || (onActive !== null && onDisable !== null)) {
        return (
            <TableCell component="th" scope="row">
                {onActive !== null && onDisable !== null && (
                    <Component.ActionFabButton
                        sx={{ marginInline: 1 }}
                        color="primary"
                        size="small"
                        aria-label="Action"
                        onClick={(e) => {
                            e.stopPropagation();
                            (item.active ? onDisable : onActive)(item.name);
                        }}
                    >
                        {item.active ? <UnpublishedIcon /> : <CheckCircleIcon />}
                    </Component.ActionFabButton>
                )}
                {onSelect !== null && item.id !== themeId && (
                    <Component.ActionFabButton
                        sx={{ marginInline: 1 }}
                        color="primary"
                        size="small"
                        aria-label="Selection"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(item.name);
                        }}
                    >
                        <CheckCircleIcon />
                    </Component.ActionFabButton>
                )}
                {onRemove !== null && (item.active === undefined || onDisable === null) && (
                    <Component.DeleteFabButton
                        sx={{ marginInline: 1 }}
                        color="error"
                        size="small"
                        aria-label="Supprimer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item.name);
                        }}
                        disabled={() => (disableDeleteFunction ? disableDeleteFunction(item) : false)}
                    >
                        <DeleteIcon />
                    </Component.DeleteFabButton>
                )}
                {onEdit !== null && (
                    <Component.EditFabButton
                        sx={{ marginInline: 1 }}
                        color="primary"
                        size="small"
                        aria-label="Modifier"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item.id);
                        }}
                        id={`editButton-${item.id}`}
                    >
                        <EditIcon />
                    </Component.EditFabButton>
                )}

                {contextualMenu ? (
                    <Component.ActionFabButton
                        sx={{ marginInline: 1 }}
                        color="error"
                        size="small"
                        id={`actionButton-${item.id}`}
                        aria-label="Menu contextuel"
                        onClick={(e) => handleClick(e, item)}
                    >
                        <MoreHorizIcon />
                    </Component.ActionFabButton>
                ) : (
                    onDelete !== null && (
                        <Component.DeleteFabButton
                            sx={{ marginInline: 1 }}
                            color="error"
                            size="small"
                            aria-label="Supprimer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item.id);
                            }}
                            id={`deleteButton-${item.id}`}
                            disabled={Boolean(disableDeleteFunction ? disableDeleteFunction(item) : false)}
                        >
                            <DeleteIcon />
                        </Component.DeleteFabButton>
                    )
                )}
            </TableCell>
        );
    }

    return <></>;
};
