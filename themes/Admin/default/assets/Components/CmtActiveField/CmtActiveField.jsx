import React from 'react';
import { Box, Switch } from '@mui/material';
import { Component } from '@/AdminService/Component';

export const CmtActiveField = ({ values, setFieldValue, text, mr = null }) => {
    return (
        <Component.ActiveFieldBlock className="block-activefield" mr={mr}>
            {text && (
                <Component.SwitchTextLabel component="span" variant="h6">
                    {text}
                </Component.SwitchTextLabel>
            )}
            <Box>
                <Component.SwitchActiveLabel component="span" variant="h6">
                    Désactiver
                </Component.SwitchActiveLabel>
                <Switch
                    checked={Boolean(values.active)}
                    onChange={(e) => {
                        setFieldValue('active', e.target.checked);
                    }}
                    size="small"
                    id="active"
                />
                <Component.SwitchActiveLabel component="span" variant="h6">
                    Activer
                </Component.SwitchActiveLabel>
            </Box>
        </Component.ActiveFieldBlock>
    );
};
