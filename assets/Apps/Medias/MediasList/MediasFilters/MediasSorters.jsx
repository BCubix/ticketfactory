import { Box, Chip, IconButton, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import React, { useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { RotatingIcons } from './sc.Filters';
import { CmtPopover } from '../../../../Components/CmtPopover/CmtPopover';

export const MediasSorters = ({ value, setValue, list }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const field = value ? value.split(' ')[0] : '';
    const order = value ? value.split(' ')[1] : '';
    const displayValue = field ? list.find((elem) => elem.value === field) : '';

    return (
        <Box ml="auto" py={2}>
            <Box display="flex" alignItems="center">
                <Chip
                    variant={value ? 'default' : 'outlined'}
                    icon={
                        !order ? (
                            <SortIcon />
                        ) : order === 'ASC' ? (
                            <ArrowUpwardIcon />
                        ) : (
                            <ArrowDownwardIcon />
                        )
                    }
                    size="medium"
                    label={displayValue?.label || 'Trier par'}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                />
            </Box>

            <CmtPopover
                anchorEl={anchorEl}
                closePopover={() => setAnchorEl(null)}
                style={{ overflow: 'visible' }}
            >
                <Box p={5} minWidth={300}>
                    <Typography component="p" variant="h4">
                        Selectionner un tri
                    </Typography>
                    <Box display="flex" alignItems="flex-start" mt={3}>
                        <Select
                            fullWidth
                            variant="standard"
                            value={field}
                            onChange={(e) => {
                                setValue(`${e.target.value} ${order}`);
                            }}
                            label={'Trier par'}
                            MenuProps={{
                                anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                },
                                transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                },
                            }}
                        >
                            {list.map((item, index) => (
                                <MenuItem value={item.value} key={index}>
                                    <ListItemText primary={item?.label} />
                                </MenuItem>
                            ))}
                        </Select>
                        <IconButton
                            mt={2}
                            size="medium"
                            color="primary"
                            onClick={() => setValue(`${field} ${order === 'ASC' ? 'DESC' : 'ASC'}`)}
                        >
                            <RotatingIcons order={order} />
                        </IconButton>
                    </Box>
                </Box>
            </CmtPopover>
        </Box>
    );
};
