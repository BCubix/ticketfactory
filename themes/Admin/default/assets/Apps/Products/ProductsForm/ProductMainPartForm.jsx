import React from 'react';

import { Grid } from '@mui/material';

import { Component } from '@/AdminService/Component';

import { changeSlug } from '@Services/utils/changeSlug';

export const ProductMainPartForm = ({ values, handleChange, handleBlur, touched, errors, setFieldTouched, setFieldValue, productCategoriesList, editMode }) => {
    return (
        <>
            <Component.CmtFormBlock title={'Informations générales'}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
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
                            sx={{ marginBottom: 6 }}
                        />
                        <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Component.CmtTextField
                            value={values.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Prix"
                            name="price"
                            error={touched.price && errors.price}
                            required
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Component.CmtTextField
                            value={values.chapo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Chapô"
                            name="chapo"
                            error={touched.chapo && errors.chapo}
                            multiline
                            rows={4}
                            required
                            sx={{ marginTop: 1 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Component.CmtEditorField
                            label="Description"
                            required
                            id={`description`}
                            name={`description`}
                            value={values.description}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            errors={touched.description && errors.description}
                        />
                    </Grid>
                </Grid>
            </Component.CmtFormBlock>

            <Component.CmtFormBlock title="Catégories">
                <Component.ProductParentCategoryPartForm
                    values={values}
                    productCategoriesList={productCategoriesList}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    errors={errors}
                />
            </Component.CmtFormBlock>

            <Component.SEOForm values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors} />
        </>
    );
};
