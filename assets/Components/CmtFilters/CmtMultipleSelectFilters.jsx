import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box,
    Checkbox,
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

export const CmtMultipleSelectFilters = ({
    list,
    value,
    setValue,
    title,
    label,
    icon,
    parameters,
    getList,
}) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [parsedValue, setParsedValue] = useState([]);
    const [displayValue, setDisplayValue] = useState('');
    const [displayList, setDisplayList] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let val = [];

        if (!value || value?.length === 0) {
            setParsedValue(val);

            return;
        }

        value?.split(',')?.forEach((el) => {
            const searchEl = parseInt(el) || el;

            const findList = displayList?.find(
                (it) => it[parameters?.nameValue || 'id'] === searchEl
            );

            if (findList) {
                val.push(findList);
            }
        });

        let displayVal = val?.length > 0 ? val[0][parameters?.nameLabel] : '';

        if (val?.length > 1) {
            displayVal += ` (+${val.length - 1})`;
        }

        setParsedValue(val);
        setDisplayValue(displayVal);
    }, [value, displayList]);

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
                            multiple
                            fullWidth
                            value={parsedValue}
                            onChange={(e) => {
                                setValue(
                                    e.target.value
                                        .map((elem) => elem[parameters?.nameValue])
                                        .join(',')
                                );
                            }}
                            renderValue={() => {
                                return displayValue;
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
                                <MenuItem key={index} value={item}>
                                    <Checkbox
                                        checked={
                                            parsedValue
                                                ?.map((elem) => elem[parameters.nameValue])
                                                .indexOf(item[parameters.nameValue]) > -1
                                        }
                                    />
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
