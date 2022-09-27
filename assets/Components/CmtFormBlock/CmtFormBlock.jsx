import { useTheme } from '@emotion/react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react';
import { CmtCard } from '../CmtCard/sc.CmtCard';

export const CmtFormBlock = ({ title, children, marginBlock = 3, ...rest }) => {
    const theme = useTheme();

    return (
        <CmtCard sx={{ marginBlock: marginBlock, position: 'relative' }} elevation={3} {...rest}>
            <CardHeader
                title={title}
                titleTypographyProps={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#FFFFFF',
                }}
                sx={{
                    borderBottom: 1,
                    borderBottomColor: 'divider',
                    backgroundColor: theme.palette.secondary.main,
                }}
            />
            <CardContent>{children}</CardContent>
        </CmtCard>
    );
};
