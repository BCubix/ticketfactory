import React from 'react';
import { Component } from '@/AdminService/Component';
import { Box } from '@mui/system';

export const CmtPageWrapper = ({ children, title, actionButton = null, ...params }) => {
    return (
        <Component.PageWrapper {...params}>
            <Box display="flex" justifyContent="space-between">
                {title && <Component.CmtPageTitle>{title}</Component.CmtPageTitle>}
                {actionButton}
            </Box>
            {children}
        </Component.PageWrapper>
    );
};
