import React, { useMemo } from 'react';

import { Crud } from '@/AdminService/Crud';
import { getPropByString } from '@Services/utils/getPropByString';
import { Box, Typography } from '@mui/material';

export const CollectionDifferenceType = ({ actualVersion, previousVersion, nextVersion, name, label, fields, ...props }) => {
    const actualVersionValue = useMemo(() => {
        return getPropByString(actualVersion, name);
    }, [actualVersion]);

    if (!actualVersionValue) {
        return <></>;
    }

    return Object.keys(actualVersionValue).map((key) => {
        return fields?.map((field, index) => {
            const FieldComponent = Crud?.events?.history?.historyTypes[field.inputType] || null;

            if (!FieldComponent) {
                return (
                    <Box key={index}>
                        <Typography component="strong">Champ inconnu :</Typography>
                    </Box>
                );
            }

            return (
                <FieldComponent
                    key={index}
                    name={`${name}.${key}${field.name ? `.${field.name}` : ''}`}
                    label={`${field.label} n°${key + 1}`}
                    fields={field.fields}
                    actualVersion={actualVersion}
                    previousVersion={previousVersion}
                    nextVersion={nextVersion}
                    {...props}
                />
            );
        });
    });
};
