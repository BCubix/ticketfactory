import {
    Chip,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useState } from 'react';
import { objectResolver } from '../../services/utils/objectResolver';
import { ActionFabButton, DeleteFabButton, EditFabButton } from '../CmtButton/sc.Buttons';
import { useTheme } from '@emotion/react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

/**
 *
 * @param {table}
 * [
 *  {
 *      name: variable name,
 *      label: header column name
 *  }
 * ]
 *
 * @param {list}
 * [
 *  {
 *      variable: value,
 *  }
 * ]
 *
 * @returns
 */
export const ListTable = ({
    table,
    list,
    filters,
    onDelete = null,
    onEdit = null,
    onClick = null,
    onDuplicate = null,
    onPreview = null,
    changeFilters = null,
    contextualMenu = false,
}) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const field = filters?.sort ? filters?.sort?.split(' ')[0] : '';
    const order = filters?.sort ? filters?.sort?.split(' ')[1] : '';

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSortClick = (newField) => {
        if (!changeFilters) {
            return;
        }

        let newOrder = '';

        if (field === newField) {
            newOrder = order === 'ASC' ? 'DESC' : 'ASC';
        } else {
            newOrder = order;
        }

        changeFilters({ ...filters, sort: `${newField} ${newOrder}` });
    };

    if (!table || table?.length === 0 || !list || list.length === 0) {
        return <></>;
    }

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650, marginTop: 5 }}>
                <TableHead>
                    <TableRow>
                        {table.map((element, index) => (
                            <TableCell key={index} sx={{ width: element.width || 'auto' }}>
                                {element.sortable ? (
                                    <TableSortLabel
                                        active={element.name === field}
                                        direction={order.toLowerCase() || 'asc'}
                                        onClick={() => handleSortClick(element.name)}
                                    >
                                        {element.label}
                                    </TableSortLabel>
                                ) : (
                                    element.label
                                )}
                            </TableCell>
                        ))}
                        {(onDelete !== null || onEdit !== null) && <TableCell>Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list?.map((item, index) => (
                        <TableRow
                            key={index}
                            onClick={() => {
                                if (onClick) {
                                    onClick(item?.id);
                                }
                            }}
                            sx={
                                onClick
                                    ? {
                                          cursor: 'pointer',
                                      }
                                    : {}
                            }
                        >
                            {table.map((tableItem, ind) => (
                                <TableCell component="th" scope="row" key={ind}>
                                    <RenderFunction item={item} tableItem={tableItem} />
                                </TableCell>
                            ))}
                            {(onDelete !== null || onEdit !== null) && (
                                <TableCell component="th" scope="row">
                                    <EditFabButton
                                        sx={{ marginInline: 1 }}
                                        color="primary"
                                        size="small"
                                        aria-label="Modifier"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(item.id);
                                        }}
                                    >
                                        <EditIcon />
                                    </EditFabButton>

                                    {contextualMenu ? (
                                        <>
                                            <ActionFabButton
                                                sx={{ marginInline: 1 }}
                                                color="error"
                                                size="small"
                                                aria-label="Supprimer"
                                                onClick={handleClick}
                                            >
                                                <MoreHorizIcon />
                                            </ActionFabButton>

                                            <Menu
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                            >
                                                <MenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(item.id);
                                                    }}
                                                    sx={{ color: theme.palette.error.main }}
                                                >
                                                    <DeleteIcon sx={{ marginRight: 2 }} /> Supprimer
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{
                                                        color: theme.palette.crud.action.textColor,
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        if (onDuplicate) {
                                                            onDuplicate(item.id);
                                                        }
                                                    }}
                                                >
                                                    <ContentCopyIcon sx={{ marginRight: 2 }} />
                                                    Dupliquer
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        if (onPreview) {
                                                            onPreview(item.id);
                                                        }
                                                    }}
                                                    sx={{ color: '#4A148C' }}
                                                >
                                                    <VisibilityIcon sx={{ marginRight: 2 }} />
                                                    Prévisualiser
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    ) : (
                                        <DeleteFabButton
                                            sx={{ marginInline: 1 }}
                                            color="error"
                                            size="small"
                                            aria-label="Supprimer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(item.id);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </DeleteFabButton>
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const RenderFunction = ({ item, tableItem }) => {
    const theme = useTheme();

    if (tableItem.renderFunction) {
        return tableItem.renderFunction(item);
    }

    if (tableItem.type === 'bool') {
        let result = objectResolver(tableItem.name, item);

        if (result === null) {
            return '';
        }

        return (
            <Chip
                sx={{ backgroundColor: '#FFFFFF' }}
                label={
                    <Typography
                        component="p"
                        variant="body1"
                        sx={{
                            color: result ? theme.palette.success.main : theme.palette.error.main,
                        }}
                    >
                        {result ? 'Oui' : 'Non'}
                    </Typography>
                }
            />
        );
    }

    return (
        <Typography component="p" variant="body1">
            {objectResolver(tableItem.name, item)}
        </Typography>
    );
};
