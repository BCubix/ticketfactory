import React from 'react';

import { Grid } from '@mui/material';

import { Component } from '@/AdminService/Component';

import { changeSlug } from '@Services/utils/changeSlug';

export const RoomsMainPartForm = ({ values, errors, touched, setFieldValue, handleChange, handleBlur, editMode }) => {
    return (
        <Component.CmtFormBlock title="Informations générales">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Component.CmtTextField
                        label="Nom"
                        required
                        name="name"
                        value={values.name}
                        onChange={(e) => {
                            setFieldValue('name', e.target.value);
                            if (!values.editSlug && !editMode) {
                                setFieldValue('slug', changeSlug(e.target.value));
                            }
                        }}
                        onBlur={handleBlur}
                        error={touched.name && errors.name}
                    />
                    <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Component.CmtTextField
                        type="number"
                        label="Nombre de places"
                        name="seatsNb"
                        value={values.seatsNb}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.seatsNb && errors.seatsNb}
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Component.CmtTextField
                        type="number"
                        label="Superficie"
                        name="area"
                        value={values.area}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.area && errors.area}
                        required
                    />
                </Grid>
            </Grid>
        </Component.CmtFormBlock>
    );
};
