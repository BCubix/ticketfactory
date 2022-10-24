import React, { useState } from 'react';
import { Box, Chip, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { CmtPopover } from '../CmtPopover/CmtPopover';
import { DeleteBlockFabButton } from '../CmtButton/sc.Buttons';
import CloseIcon from '@mui/icons-material/Close';
import { ClearBooleanButton } from './sc.Filters';

export const CmtBooleanFilters = ({ value, setValue, title, label, icon = null }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <Box mx={1} py={2}>
            <Box display="flex" alignItems="center" justifyContent="center" className="fullHeight">
                <Chip
                    variant={null !== value ? 'default' : 'outlined'}
                    icon={icon}
                    size="medium"
                    label={label}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    onDelete={null !== value ? () => setValue(null) : null}
                />
            </Box>

            <CmtPopover anchorEl={anchorEl} closePopover={() => setAnchorEl(null)}>
                <Box p={5}>
                    <Box className="flex row-between">
                        <Typography mb={2} component="p" mt={1} variant="h4">
                            {title}
                        </Typography>

                        {null !== value && (
                            <ClearBooleanButton
                                size="small"
                                onClick={() => {
                                    setValue(null);
                                }}
                            >
                                <CloseIcon />
                            </ClearBooleanButton>
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
                        <FormControlLabel value={false} control={<Radio />} label={'Non'} />

                        <FormControlLabel value={true} control={<Radio />} label={'Oui'} />
                    </RadioGroup>
                </Box>
            </CmtPopover>
        </Box>
    );
};