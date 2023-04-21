import React from 'react';
import { Grid } from '@mui/material';
import { Component } from '@/AdminService/Component';

const TYPE = 'string';

function getType() {
    return TYPE;
}

const getComponent = ({ paramName, paramKey, paramValue, paramBreakpoints, setFieldValue, indexTab, indexBlock, indexParam }) => {
    return (
        <Grid item key={indexParam} {...paramBreakpoints}>
            <Component.CmtTextField
                id={paramKey}
                label={paramName}
                value={paramValue}
                onChange={(e) => {
                    setFieldValue(`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`, e.target.value);
                }}
            />
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
