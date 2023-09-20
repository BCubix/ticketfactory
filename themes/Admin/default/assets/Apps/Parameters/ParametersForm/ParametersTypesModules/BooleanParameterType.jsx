import React from 'react';
import { FormControl, FormControlLabel, Grid, Switch } from '@mui/material';

const TYPE = 'bool';

function getType() {
    return TYPE;
}

const getComponent = ({ paramName, paramKey, paramValue, paramBreakpoints, setFieldValue, indexTab, indexBlock, indexParam }) => {
    return (
        <Grid item key={indexParam} {...paramBreakpoints} display="flex" alignItems="center">
            <FormControl fullWidth>
                <FormControlLabel
                    size="small"
                    id={paramKey}
                    value={paramValue}
                    onChange={(e) => {
                        setFieldValue(`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`, e.target.checked);
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
