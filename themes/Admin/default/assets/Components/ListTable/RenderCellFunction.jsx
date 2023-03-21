import React from 'react';
import { useTheme } from '@emotion/react';
import { Chip, Typography } from '@mui/material';

import { objectResolver } from '@Services/utils/objectResolver';

export const RenderCellFunction = ({ item, tableItem }) => {
    const theme = useTheme();

    if (tableItem.renderFunction) {
        return tableItem.renderFunction(item);
    }

    if (tableItem.type === 'bool') {
        let result = objectResolver(tableItem.name, item);

        if (result === null) {
            return '';
        }

        return (
            <Chip
                sx={{ backgroundColor: '#FFFFFF' }}
                label={
                    <Typography
                        component="p"
                        variant="body1"
                        sx={{
                            color: result ? theme.palette.success.main : theme.palette.error.main,
                        }}
                    >
                        {result ? 'Oui' : 'Non'}
                    </Typography>
                }
            />
        );
    }

    return (
        <Typography component="p" variant="body2">
            {objectResolver(tableItem.name, item)}
        </Typography>
    );
};
