import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { Component } from "@/AdminService/Component";
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CmtSimpleSelectFilters = ({
    list,
    value,
    setValue,
    title,
    label,
    icon,
    parameters,
    getList,
    id,
}) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [displayList, setDisplayList] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGetList = () => {
        if (displayList) {
            return;
        }

        if (list) {
            setDisplayList(list);
        }

        if (!getList) {
            return;
        }

        setLoading(true);

        apiMiddleware(dispatch, async () => {
            const result = await getList();

            if (result) {
                setDisplayList(result);
            }

            setLoading(false);
        });
    };

    return (
        <Box mx={1} py={2}>
            <Box display="flex" alignItems="center" justifyContent="center" className="fullHeight">
                <Chip
                    variant={value ? 'default' : 'outlined'}
                    icon={icon}
                    size="medium"
                    id={id ? id + 'Chip' : null}
                    label={label}
                    onClick={(e) => {
                        handleGetList();
                        setAnchorEl(e.currentTarget);
                    }}
                    onDelete={value ? () => setValue('') : null}
                />
            </Box>

            <Component.CmtPopover anchorEl={anchorEl} closePopover={() => setAnchorEl(null)}>
                <Box p={5}>
                    <Typography mb={2} component="p" variant="h4">
                        {title}
                    </Typography>

                    <FormControl fullWidth sx={{ marginTop: 5 }}>
                        <InputLabel id={`choice-${title}-label`} size="small">
                            {label}
                        </InputLabel>
                        <Select
                            variant="standard"
                            fullWidth
                            value={value}
                            id={id ? id + 'Select' : null}
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            label={label}
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
                            {loading && (
                                <Box margin={5} display="flex" justifyContent={'center'}>
                                    <CircularProgress color="inherit" />
                                </Box>
                            )}
                            {displayList?.map((item, index) => (
                                <MenuItem
                                    id={id ? id + 'Value-' + item[parameters.nameValue] : null}
                                    key={index}
                                    value={item[parameters.nameValue]}
                                >
                                    <ListItemText primary={item[parameters?.nameLabel]} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Component.CmtPopover>
        </Box>
    );
};
