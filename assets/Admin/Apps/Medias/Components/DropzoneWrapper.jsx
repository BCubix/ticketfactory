import React from 'react';
import { Box } from '@mui/system';

export const DropzoneWrapper = ({ children, sx, ...rest }) => {
    return (
        <Box
            className="dropzone"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 1,
                mb: 3,
                padding: 8,
                minHeight: 120,
                borderRadius: 1,
                border: '2px dashed #BBB',
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};
