import { FormControl, Grid, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import React from 'react';

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
                        setFieldValue(
                            `tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`,
                            e.target.value
                        );
                    }}
                >
                    {paramAvailableValue?.map(({ id, name }, index) => (
                        <MenuItem value={id} key={index}>
                            <ListItemText>{name}</ListItemText>
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
