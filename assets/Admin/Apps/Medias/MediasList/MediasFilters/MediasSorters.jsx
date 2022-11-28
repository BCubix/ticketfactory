import React, { useState } from 'react';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SortIcon from '@mui/icons-material/Sort';
import { Box, Chip, IconButton, ListItemText, MenuItem, Select, Typography } from '@mui/material';

import { Component } from "@/AdminService/Component";

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

            <Component.CmtPopover
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
                            <Component.RotatingIcons order={order} />
                        </IconButton>
                    </Box>
                </Box>
            </Component.CmtPopover>
        </Box>
    );
};
