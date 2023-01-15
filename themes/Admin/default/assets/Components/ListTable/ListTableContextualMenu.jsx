import React from 'react';

import { Menu, MenuItem } from '@mui/material';
import { useTheme } from '@emotion/react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TranslateIcon from '@mui/icons-material/Translate';

export const ListTableContextualMenu = ({
    contextualMenu,
    anchorEl,
    setAnchorEl,
    handleClose,
    onDelete,
    selectedMenuItem,
    setSelectedMenuItem,
    onTranslate,
    languagesData,
    setTranslateItem,
    onDuplicate,
    onPreview,
}) => {
    const theme = useTheme();
    const open = Boolean(anchorEl);

    if (!contextualMenu) {
        return <></>;
    }

    return (
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
    );
};
