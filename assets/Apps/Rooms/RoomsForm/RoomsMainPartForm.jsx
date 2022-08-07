import { Grid } from '@mui/material';
import React from 'react';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';

export const RoomsMainPartForm = ({ values, errors, touched, handleChange, handleBlur }) => {
    return (
        <CmtFormBlock title="Informations générales">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <CmtTextField
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Nom"
                        name="name"
                        autoComplete="name"
                        error={touched.name && errors.name}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <CmtTextField
                        value={values.seatsNb}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Nombre de places"
                        name="seatsNb"
                        error={touched.seatsNb && errors.seatsNb}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <CmtTextField
                        value={values.area}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Superficie"
                        name="area"
                        error={touched.area && errors.area}
                    />
                </Grid>
            </Grid>
        </CmtFormBlock>
    );
};
