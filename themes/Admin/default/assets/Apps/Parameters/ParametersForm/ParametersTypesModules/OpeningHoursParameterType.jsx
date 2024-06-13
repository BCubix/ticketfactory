import React from 'react';
import { FormControl, Grid, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';

const TYPE = 'openingHours';

function getType() {
    return TYPE;
}

const getComponent = ({ paramName, paramKey, paramValue, paramBreakpoints, setFieldValue, indexTab, indexBlock, indexParam }) => {
    return (
        <Grid item key={indexParam} {...paramBreakpoints}>
            <Typography marginTop={3}>{paramName}</Typography>
            <FormControl fullWidth>
                {paramValue &&
                    Object.entries(paramValue)?.map(([key, value], index) => (
                        <Component.CmtTextField
                            key={index}
                            id={paramKey}
                            label={key}
                            value={value || ''}
                            onChange={(e) => {
                                setFieldValue(`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue.${key}`, e.target.value);
                            }}
                        />
                    ))}
            </FormControl>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
