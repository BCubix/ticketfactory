import React from 'react';

import {CmtFormBlock} from "@Components/CmtFormBlock/CmtFormBlock";

import {FormControl, Grid, InputLabel, ListItemText, MenuItem, Select} from "@mui/material";

function ParametersBlockForm({tabName, parameters, handleChange, handleBlur, touched, errors, setFieldTouched, setFieldValue}) {
    return (
        <CmtFormBlock title={'Types par défaut'}>
            <Grid container spacing={4}>
                {parameters?.map(({id, name, key, type, value, availableValue}, index) => {
                    switch (type) {
                        case 'list':
                            return (
                                <Grid item xs={12} sm={6} key={index}>
                                    <FormControl fullWidth sx={{marginBlock: 3}}>
                                        <InputLabel id={`${key}-label`} size="small">
                                            {name}
                                        </InputLabel>
                                        <Select
                                            labelId={`${key}-label`}
                                            size="small"
                                            variant="standard"
                                            id={key}
                                            label={name}
                                            value={value}
                                            onChange={(e) => {
                                                setFieldValue(`parameters.${tabName}.${index}.value`, e.target.value)
                                            }}
                                        >
                                            {availableValue?.map(({id, name}, index) => (
                                                <MenuItem value={id} key={index}>
                                                    <ListItemText>{name}</ListItemText>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            );
                        default:
                            break;
                    }
                })}
            </Grid>
        </CmtFormBlock>
    );
}

export default ParametersBlockForm;