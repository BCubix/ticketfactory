import React from 'react';
import { TableCell } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Component } from '@/AdminService/Component';

export const ListTableCellButtons = ({
    item,
    onDelete,
    onEdit,
    onRemove,
    onSelect,
    onActive,
    onDisable,
    disableDeleteFunction,
    contextualMenu,
    themeId,
    handleClick,
    expendElementTranslation,
    setExpendElementTranslation,
}) => {
    if (onDelete !== null || onEdit !== null || (onRemove !== null && onSelect !== null) || (onActive !== null && onDisable !== null)) {
        return (
            <TableCell component="td" scope="row">
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

                {item?.translatedElements?.length > 0 && (
                    <Component.ActionFabButton
                        sx={{ marginInline: 1 }}
                        color="error"
                        size="small"
                        id={`actionButton-${item.id}`}
                        aria-label="Menu contextuel"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpendElementTranslation(expendElementTranslation?.id === item?.id ? null : item);
                        }}
                    >
                        <KeyboardArrowDownIcon sx={{ transition: '.3s', transform: expendElementTranslation?.id === item?.id && 'rotate(-180deg)' }} />
                    </Component.ActionFabButton>
                )}
            </TableCell>
        );
    }

    return <></>;
};
