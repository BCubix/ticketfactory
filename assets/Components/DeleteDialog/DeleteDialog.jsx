import React from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Box } from '@mui/system';

export const DeleteDialog = ({ open = false, onCancel, onDelete, children }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogContent dividers>{children}</DialogContent>

            <DialogActions>
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                    <Button color="primary" onClick={onCancel} id="cancelDeleteDialog">
                        Annuler
                    </Button>
                    <Button color="error" onClick={onDelete} id="validateDeleteDialog">
                        Supprimer
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
