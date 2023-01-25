import React from 'react';
import { useTheme } from '@emotion/react';
import { CardContent, CardHeader } from '@mui/material';
import { Component } from '@/AdminService/Component';

export const CmtFormBlock = ({ title, children, paddingContent = null, marginBlock = 3, ...rest }) => {
    return (
        <Component.CmtCard sx={{ marginBlock: marginBlock, position: 'relative' }} elevation={3} {...rest}>
            <CardHeader title={title} />
            <CardContent sx={{ ...(paddingContent !== null && { padding: paddingContent, '&:last-child': { paddingBottom: 0 } }) }}>{children}</CardContent>
        </Component.CmtCard>
    );
};
