import React from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Box } from '@mui/system';

export const DeleteDialog = ({ open = false, onCancel, onDelete = null, deleteText, children }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogContent dividers>{children}</DialogContent>

            <DialogActions>
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                    <Button color="primary" onClick={onCancel} id="cancelDeleteDialog">
                        Annuler
                    </Button>
                    {onDelete && (
                        <Button color="error" onClick={onDelete} id="validateDeleteDialog">
                            {deleteText || 'Supprimer'}
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};
