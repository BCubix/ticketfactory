import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react';

export const CmtFormBlock = ({ title, children, marginBlock = 3, ...rest }) => {
    return (
        <Card sx={{ padding: 1, marginBlock: marginBlock }} elevation={3} {...rest}>
            <Typography pl={2} component="h2" variant="body1">
                {title}
            </Typography>

            <CardContent>{children}</CardContent>
        </Card>
    );
};
