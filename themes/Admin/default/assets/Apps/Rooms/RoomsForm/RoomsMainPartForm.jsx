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
                        value={values.name}
                        onChange={(e) => {
                            setFieldValue('name', e.target.value);
                            if (!values.editSlug && !editMode) {
                                setFieldValue('slug', changeSlug(e.target.value));
                            }
                        }}
                        onBlur={handleBlur}
                        label="Nom"
                        name="name"
                        error={touched.name && errors.name}
                        required
                    />
                    <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Component.CmtTextField
                        value={values.seatsNb}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Nombre de places"
                        name="seatsNb"
                        error={touched.seatsNb && errors.seatsNb}
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Component.CmtTextField
                        value={values.area}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Superficie"
                        name="area"
                        error={touched.area && errors.area}
                        required
                    />
                </Grid>
            </Grid>
        </Component.CmtFormBlock>
    );
};
