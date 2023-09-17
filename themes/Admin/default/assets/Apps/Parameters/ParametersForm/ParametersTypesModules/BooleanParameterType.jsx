import React from 'react';
import { Grid } from '@mui/material';
import { Component } from '@/AdminService/Component';

const TYPE = 'bool';

function getType() {
    return TYPE;
}

const getComponent = ({ paramName, paramKey, paramValue, paramBreakpoints, setFieldValue, indexTab, indexBlock, indexParam }) => {
    return (
        <Grid item key={indexParam} {...paramBreakpoints}>
            <FormControl fullWidth>
                <FormControlLabel
                    size="small"
                    id={paramKey}
                    value={paramValue}
                    onChange={(e) => {
                        setFieldValue(`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`, e.target.value);
                    }}
                    label={paramName}
                    labelPlacement="start"
                    control={<Switch checked={Boolean(paramValue)} />}
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginLeft: 0,
                        marginBlock: 0,
                    }}
                />
            </FormControl>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
