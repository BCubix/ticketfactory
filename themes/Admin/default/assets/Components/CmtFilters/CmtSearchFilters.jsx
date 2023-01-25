import React, { useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';

export const CmtSearchFilters = ({ value, setValue, title, label, icon = null, id }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <Box mx={1} py={2}>
            <Box display="flex" alignItems="center" justifyContent="center" className="fullHeight">
                <Component.FilterChip
                    variant={'outlined'}
                    icon={icon}
                    size="medium"
                    label={label}
                    id={id ? id + 'Chip' : null}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    onDelete={value ? () => setValue('') : null}
                    sx={{ backgroundColor: !value && '#FFFFFF' }}
                    isActive={value || value === false}
                />
            </Box>

            <Component.CmtPopover anchorEl={anchorEl} closePopover={() => setAnchorEl(null)}>
                <Box p={5}>
                    <Typography mb={2} component="p" variant="h4">
                        {title}
                    </Typography>

                    <Component.CmtTextField value={value} onChange={(e) => setValue(e.target.value)} id={id ? id + 'Search' : null} label={label} />
                </Box>
            </Component.CmtPopover>
        </Box>
    );
};
