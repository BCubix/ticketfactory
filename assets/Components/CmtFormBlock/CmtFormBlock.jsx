import React from 'react';
import { useTheme } from '@emotion/react';
import { CardContent, CardHeader } from '@mui/material';
import { Component } from "@/AdminService/Component";

export const CmtFormBlock = ({ title, children, marginBlock = 3, ...rest }) => {
    const theme = useTheme();

    return (
        <Component.CmtCard sx={{ marginBlock: marginBlock, position: 'relative' }} elevation={3} {...rest}>
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
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                }}
            />
            <CardContent>{children}</CardContent>
        </Component.CmtCard>
    );
};
