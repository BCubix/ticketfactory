import React from 'react';
import { FormControl, Grid, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';

const TYPE = 'list';

function getType() {
    return TYPE;
}

const getComponent = ({
    paramName,
    paramKey,
    paramValue,
    paramAvailableValue,
    paramBreakpoints,
    setFieldValue,
    indexTab,
    indexBlock,
    indexParam,
    paramValueKey = 'id',
    paramNameKey = 'name',
    getName = null,
}) => {
    return (
        <Grid item key={indexParam} {...paramBreakpoints}>
            <FormControl fullWidth sx={{ marginBlock: 3 }}>
                <InputLabel id={`${paramKey}-label`} size="small">
                    {paramName}
                </InputLabel>
                <Select
                    labelId={`${paramKey}-label`}
                    size="small"
                    variant="standard"
                    id={paramKey}
                    label={paramName}
                    value={paramValue}
                    onChange={(e) => {
                        setFieldValue(`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`, e.target.value);
                    }}
                >
                    {paramAvailableValue?.map((item, index) => (
                        <MenuItem value={item[paramValueKey]} key={index}>
                            <ListItemText>{getName ? getName(item) : item[paramNameKey]}</ListItemText>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
