import React from 'react';
import { Grid, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';

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
            <InputLabel id={`${paramKey}-label`} size="small" sx={{ fontSize: 11, mb: 3 }}>
                {paramName}
            </InputLabel>
            <Select
                labelId={`${paramKey}-label`}
                size="small"
                fullWidth
                variant="standard"
                id={paramKey}
                label={paramName}
                value={paramValue || ''}
                onChange={(e) => {
                    setFieldValue(`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`, e.target.value);
                }}
                displayEmpty
            >
                <MenuItem value={''}>
                    <ListItemText>Pas de {paramName.charAt(0).toLowerCase() + paramName.slice(1)} </ListItemText>
                </MenuItem>
                {paramAvailableValue?.map((item, index) => (
                    <MenuItem value={item[paramValueKey]} key={index}>
                        <ListItemText>{getName ? getName(item) : item[paramNameKey]}</ListItemText>
                    </MenuItem>
                ))}
            </Select>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
