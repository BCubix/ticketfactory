import React, { useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { CmtPopover } from '../CmtPopover/CmtPopover';
import { CmtTextField } from '../CmtTextField/CmtTextField';

export const CmtSearchFilters = ({ value, setValue, title, label, icon = null }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <Box mx={1} py={2}>
            <Box display="flex" alignItems="center" justifyContent="center" className="fullHeight">
                <Chip
                    variant={value ? 'default' : 'outlined'}
                    icon={icon}
                    size="medium"
                    label={label}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    onDelete={value ? () => setValue('') : null}
                />
            </Box>

            <CmtPopover anchorEl={anchorEl} closePopover={() => setAnchorEl(null)}>
                <Box p={5}>
                    <Typography mb={2} component="p" variant="h4">
                        {title}
                    </Typography>

                    <CmtTextField
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        label={label}
                    />
                </Box>
            </CmtPopover>
        </Box>
    );
};
