import React from 'react';
import { Crud } from '@/AdminService/Crud';
import { Box, Typography } from '@mui/material';

export const DisplayEventHistoryFields = ({ fields, ...props }) => {
    return fields?.map((field, index) => {
        const FieldComponent = Crud?.events?.history?.historyTypes[field.inputType] || null;

        if (!FieldComponent) {
            return (
                <Box key={index}>
                    <Typography component="strong">Champ inconnu :</Typography>
                </Box>
            );
        }

        return <FieldComponent key={index} name={field.name} label={field.label} {...props} />;
    });
};
