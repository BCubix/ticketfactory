import React from 'react';
import { Popover } from '@mui/material';

export const CmtPopover = ({
    anchorEl,
    closePopover,
    anchorOrigin = null,
    transformOrigin = null,
    children,
    ...rest
}) => {
    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={closePopover}
            anchorOrigin={
                anchorOrigin || {
                    vertical: 'bottom',
                    horizontal: 'left',
                }
            }
            transformOrigin={
                transformOrigin || {
                    vertical: 'top',
                    horizontal: 'left',
                }
            }
            {...rest}
        >
            {children}
        </Popover>
    );
};
