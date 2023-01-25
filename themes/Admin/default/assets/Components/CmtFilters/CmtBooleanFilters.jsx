import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Chip, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';

export const CmtBooleanFilters = ({ value, setValue, title, label, icon = null, id }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <Box mx={1} py={2}>
            <Box display="flex" alignItems="center" justifyContent="center" className="fullHeight">
                <Component.FilterChip
                    variant={'outlined'}
                    icon={icon}
                    size="medium"
                    id={id ? id + 'Chip' : null}
                    label={label}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    onDelete={null !== value ? () => setValue(null) : null}
                    isActive={value || value === false}
                />
            </Box>

            <Component.CmtPopover anchorEl={anchorEl} closePopover={() => setAnchorEl(null)}>
                <Box p={5}>
                    <Box className="flex row-between">
                        <Typography mb={2} component="p" mt={1} variant="h4">
                            {title}
                        </Typography>

                        {null !== value && (
                            <Component.ClearBooleanButton
                                size="small"
                                onClick={() => {
                                    setValue(null);
                                }}
                            >
                                <CloseIcon />
                            </Component.ClearBooleanButton>
                        )}
                    </Box>

                    <RadioGroup
                        size="small"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value === 'true' ? true : false);
                        }}
                        label={label}
                    >
                        <FormControlLabel value={false} id={id ? id + 'Value-False' : null} control={<Radio />} label={'Non'} />

                        <FormControlLabel value={true} id={id ? id + 'Value-True' : null} control={<Radio />} label={'Oui'} />
                    </RadioGroup>
                </Box>
            </Component.CmtPopover>
        </Box>
    );
};
