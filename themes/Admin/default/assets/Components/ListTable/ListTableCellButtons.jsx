import React, { useMemo } from 'react';
import { TableCell } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Component } from '@/AdminService/Component';

export const ListTableCellButtons = ({
    item,
    onDelete,
    onEdit,
    onRemove,
    onSelect,
    onDisable,
    onPreview,
    onDuplicate,
    disableDeleteFunction,
    contextualMenu,
    handleClick,
    expendElementTranslation,
    setExpendElementTranslation,
    additionnalOptions,
    accessUserCreate,
    accessUserEdit,
    accessUserDelete,
}) => {
    const checkContextualMenu = useMemo(() => {
        if (!contextualMenu) {
            return false;
        }

        if (onPreview) {
            return true;
        }

        if (accessUserDelete !== false) {
            return true;
        }

        if (accessUserCreate !== false) {
            if ((null !== onTranslate && languageList?.length > 0) || onDuplicate) {
                return true;
            }
        }
    }, []);

    if (onDelete !== null || onEdit !== null || (onRemove !== null && onSelect !== null) || onPreview !== null || additionnalOptions?.length > 0) {
        return (
            <TableCell component="td" scope="row">
                {accessUserDelete !== false && onRemove !== null && (item.active === undefined || onDisable === null) && (
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

                {accessUserEdit !== false && onEdit !== null && (
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

                {onPreview && !contextualMenu && (
                    <Component.ActionFabButton sx={{ marginInline: 1 }} size="small" id={`previewButton-${item.id}`} aria-label="Preview" onClick={() => onPreview(item)}>
                        <VisibilityIcon />
                    </Component.ActionFabButton>
                )}

                {checkContextualMenu ? (
                    <Component.ActionFabButton
                        sx={{ marginInline: 1 }}
                        size="small"
                        id={`actionButton-${item.id}`}
                        aria-label="Menu contextuel"
                        onClick={(e) => handleClick(e, item)}
                    >
                        <MoreHorizIcon />
                    </Component.ActionFabButton>
                ) : (
                    accessUserDelete !== false &&
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

                {additionnalOptions.map((AdditionnalItem, index) => {
                    if (!AdditionnalItem({ item })) {
                        return <React.Fragment key={index} />;
                    }

                    return <AdditionnalItem item={item} key={index} />;
                })}

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
