import React from 'react';
import { FormControl, Grid } from '@mui/material';

import { Component } from '@/AdminService/Component';

const TYPE = 'multipleList';

function getType() {
    return TYPE;
}

const getComponent = ({ paramName, paramKey, paramValue, paramAvailableValue, paramBreakpoints, setFieldValue, indexTab, indexBlock, indexParam }) => {
    return (
        <Grid item key={indexParam} {...paramBreakpoints}>
            <FormControl fullWidth sx={{ marginBlock: 3 }}>
                <Component.CmtSelectField
                    label={paramName}
                    id={paramKey}
                    name={`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`}
                    value={paramValue ? paramValue.split(', ') : []}
                    list={paramAvailableValue}
                    getValue={(item) => item?.id}
                    getName={(item) => item?.name}
                    setFieldValue={(name, value) => {
                        setFieldValue(name, value.join(', '));
                    }}
                    multiple
                />
            </FormControl>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
