import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import React from 'react';

export const ProfileRightsForm = ({ rolesList, values, setFieldValue }) => {
    const handleChange = (role) => {
        if (values.roles.includes(role.id)) {
            setFieldValue(
                'roles',
                values?.roles?.filter((r) => r !== role.id)
            );
        } else {
            setFieldValue('roles', [...values?.roles, role.id]);
        }
    };

    return Object.entries(rolesList).map(([key, value], index) => {
        return (
            <Box key={index} className="profile_rights_group">
                <Typography className="txt-bold profile_rights_group_name">{key}</Typography>
                <Grid container spacing={4}>
                    {value.map((role, roleIndex) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={roleIndex}>
                            <FormControlLabel control={<Checkbox checked={values?.roles?.includes(role.id)} onChange={() => handleChange(role)} />} label={role.label} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    });
};
