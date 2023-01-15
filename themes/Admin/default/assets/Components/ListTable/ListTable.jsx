import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@emotion/react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import TranslateIcon from '@mui/icons-material/Translate';

import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { objectResolver } from '@Services/utils/objectResolver';

import { languagesSelector } from '@Redux/languages/languagesSlice';
import { Box } from '@mui/system';

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
    onActive = null,
    onDelete = null,
    onTranslate = null,
    onDisable = null,
    onEdit = null,
    onClick = null,
    onDuplicate = null,
    onPreview = null,
    onRemove = null,
    onSelect = null,
    themeId = null,
    changeFilters = null,
    contextualMenu = false,
    disableDeleteFunction = null,
}) => {
    const theme = useTheme();
    const languagesData = useSelector(languagesSelector);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [translateItem, setTranslateItem] = useState(false);
    const [translateLanguage, setTranslateLanguage] = useState('');
    const open = Boolean(anchorEl);
    const field = filters?.sort ? filters?.sort?.split(' ')[0] : '';
    const order = filters?.sort ? filters?.sort?.split(' ')[1] : '';

    const handleClick = (event, selectedMenu) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedMenuItem(selectedMenu);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedMenuItem(null);
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
                                    <TableSortLabel active={element.name === field} direction={order.toLowerCase() || 'asc'} onClick={() => handleSortClick(element.name)}>
                                        {element.label}
                                    </TableSortLabel>
                                ) : (
                                    element.label
                                )}
                            </TableCell>
                        ))}
                        {(onDelete !== null || onEdit !== null || (onRemove !== null && onSelect !== null) || (onActive !== null && onDisable !== null)) && (
                            <TableCell>Actions</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list?.map((item, index) => (
                        <TableRow
                            key={index}
                            id={`tableElement-${item.id}`}
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
                            {(onDelete !== null || onEdit !== null || (onRemove !== null && onSelect !== null) || (onActive !== null && onDisable !== null)) && (
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
                            )}
                        </TableRow>
                    ))}

                    {contextualMenu && (
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <MenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(selectedMenuItem.id);
                                    setSelectedMenuItem(null);
                                    setAnchorEl(null);
                                }}
                                id={`deleteButton-${selectedMenuItem?.id}`}
                                sx={{ color: theme.palette.error.main }}
                            >
                                <DeleteIcon sx={{ marginRight: 2 }} /> Supprimer
                            </MenuItem>
                            {null !== onTranslate && null !== languagesData?.total && languagesData?.total > 1 && (
                                <MenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAnchorEl(null);
                                        setTranslateItem(selectedMenuItem);
                                        setSelectedMenuItem(null);
                                    }}
                                    id={`translateButton-${selectedMenuItem?.id}`}
                                    sx={{ color: theme.palette.crud.action.textColor }}
                                >
                                    <TranslateIcon sx={{ marginRight: 2 }} /> Traduire
                                </MenuItem>
                            )}
                            <MenuItem
                                sx={{
                                    color: theme.palette.crud.action.textColor,
                                }}
                                id={`duplicateButton-${selectedMenuItem?.id}`}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (onDuplicate) {
                                        onDuplicate(selectedMenuItem.id);
                                        setSelectedMenuItem(null);
                                        setAnchorEl(null);
                                    }
                                }}
                            >
                                <ContentCopyIcon sx={{ marginRight: 2 }} />
                                Dupliquer
                            </MenuItem>
                            <MenuItem
                                id={`previewButton-${selectedMenuItem?.id}`}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (onPreview) {
                                        onPreview(selectedMenuItem.id);
                                        setSelectedMenuItem(null);
                                        setAnchorEl(null);
                                    }
                                }}
                                sx={{ color: '#4A148C' }}
                            >
                                <VisibilityIcon sx={{ marginRight: 2 }} />
                                Prévisualiser
                            </MenuItem>
                        </Menu>
                    )}
                </TableBody>
            </Table>
            <Dialog open={Boolean(translateItem)} onClose={() => setTranslateItem(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontSize: 20 }}>Traduction</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ marginTop: 3 }}>
                        <InputLabel id={`translate-label`} size="small">
                            Langue
                        </InputLabel>
                        <Select
                            labelId={`translate-label`}
                            variant="standard"
                            size="small"
                            id={`translateLanguage`}
                            value={translateLanguage}
                            onChange={(e) => {
                                setTranslateLanguage(e.target.value);
                            }}
                            label="Langue de traduction"
                        >
                            {languagesData?.languages
                                ?.filter((el) => el.id !== translateItem?.lang?.id)
                                ?.map((language, index) => (
                                    <MenuItem key={index} value={language?.id} id={`selectTranslateLanguage-${language?.id}`}>
                                        {language?.name} ({language?.isoCode})
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                        <Button
                            color="error"
                            onClick={() => {
                                setTranslateItem(null);
                            }}
                            id="cancelDialog"
                        >
                            Annuler
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                if (translateLanguage !== '') {
                                    onTranslate(translateItem?.id, translateLanguage);
                                } else {
                                    NotificationManager.error('Veuillez renseigner la langue.', 'Erreur', Constant.REDIRECTION_TIME);
                                }
                            }}
                            id="validateDialog"
                        >
                            Suivant
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
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
