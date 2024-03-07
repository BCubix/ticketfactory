import { Box } from '@mui/system';
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';

export const SeoInitialValues = {
    metaTitle: (initValues) => initValues?.metaTitle || '',
    metaDescription: (initValues) => initValues?.metaDescription || '',
    socialImage: (initValues) => initValues?.socialImage || null,
    fbTitle: (initValues) => initValues?.fbTitle || '',
    fbDescription: (initValues) => initValues?.fbDescription || '',
    twTitle: (initValues) => initValues?.twTitle || '',
    twDescription: (initValues) => initValues?.twDescription || '',
    indexed: (initValues) => (initValues?.indexed || initValues?.indexed === false ? initValues?.indexed : true),
};

export const SeoApiDataFields = {
    type: 'object',
    subFields: {
        socialImage: { type: 'id' },
        metaTitle: { type: 'string' },
        metaDescription: { type: 'string' },
        fbTitle: { type: 'string' },
        fbDescription: { type: 'string' },
        twTitle: { type: 'string' },
        twDescription: { type: 'string' },
        indexed: { type: 'boolean' },
    },
};

export const SeoInitialFormInputs = {
    type: 'block',
    title: 'SEO & Social Media',
    keyId: 'block-seo',
    fields: [
        {
            component: () => (
                <Box sx={{ marginBlock: 3 }}>
                    <Typography>
                        Si les champs suivants sont laissés vides, ils seront automatiquement générés à l'enregistrement à partir des champs titre et description.
                    </Typography>
                    <Typography>
                        Le texte saisi dans le champ URL sera transformé au bon format (retrait des accents, mise en minuscules, remplacement des espaces par des tirets...)
                    </Typography>
                </Box>
            ),
        },
        {
            keyId: 'input-seo-socialImage',
            style: { xs: 12 },
            input: {
                name: 'seo.socialImage',
                label: 'Social Image',
                inputType: 'cmtImage',
                width: '25%',
            },
        },
        {
            keyId: 'input-seo-metaTitle',
            style: { xs: 12, sm: 6 },
            input: {
                name: 'seo.metaTitle',
                label: 'Meta titre',
                inputType: 'textField',
                inputProps: {
                    maxLength: 86,
                },
                custom: {
                    helperText: ({ touched, values }) => {
                        return touched?.seo?.metaTitle ? (
                            <Box component="span" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography component="span">{values?.seo?.metaTitle?.length} / 86</Typography>
                            </Box>
                        ) : (
                            <></>
                        );
                    },
                },
            },
        },
        {
            keyId: 'input-seo-metaDescription',
            style: { xs: 12, sm: 6 },
            input: {
                name: 'seo.metaDescription',
                label: 'Meta description',
                inputType: 'textField',
                inputProps: {
                    maxLength: 220,
                },
                custom: {
                    helperText: ({ touched, values }) => {
                        return touched?.seo?.metaDescription ? (
                            <Box component="span" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography component="span">{values?.seo?.metaDescription?.length} / 220</Typography>
                            </Box>
                        ) : (
                            <></>
                        );
                    },
                },
            },
        },
        {
            keyId: 'input-seo-fbTitle',
            style: { xs: 12, sm: 6 },
            input: {
                name: 'seo.fbTitle',
                label: 'Titre Facebook',
                inputType: 'textField',
                inputProps: {
                    maxLength: 74,
                },
                custom: {
                    helperText: ({ touched, values }) => {
                        return touched?.seo?.fbTitle ? (
                            <Box component="span" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography component="span">{values?.seo?.fbTitle?.length} / 74</Typography>
                            </Box>
                        ) : (
                            <></>
                        );
                    },
                },
            },
        },
        {
            keyId: 'input-seo-fbDescription',
            style: { xs: 12, sm: 6 },
            input: {
                name: 'seo.fbDescription',
                label: 'Description Facebook',
                inputType: 'textField',
                inputProps: {
                    maxLength: 160,
                },
                custom: {
                    helperText: ({ touched, values }) => {
                        return touched?.seo?.fbDescription ? (
                            <Box component="span" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography component="span">{values?.seo?.fbDescription?.length} / 160</Typography>
                            </Box>
                        ) : (
                            <></>
                        );
                    },
                },
            },
        },
        {
            keyId: 'input-seo-twTitle',
            style: { xs: 12, sm: 6 },
            input: {
                name: 'seo.twTitle',
                label: 'Titre Twitter',
                inputType: 'textField',
                inputProps: {
                    maxLength: 60,
                },
                custom: {
                    helperText: ({ touched, values }) => {
                        return touched?.seo?.twTitle ? (
                            <Box component="span" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography component="span">{values?.seo?.twTitle?.length} / 60</Typography>
                            </Box>
                        ) : (
                            <></>
                        );
                    },
                },
            },
        },
        {
            keyId: 'input-seo-twDescription',
            style: { xs: 12, sm: 6 },
            input: {
                name: 'seo.twDescription',
                label: 'Description Twitter',
                inputType: 'textField',
                inputProps: {
                    maxLength: 142,
                },
                custom: {
                    helperText: ({ touched, values }) => {
                        return touched?.seo?.twDescription ? (
                            <Box component="span" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography component="span">{values?.seo?.twDescription?.length} / 142</Typography>
                            </Box>
                        ) : (
                            <></>
                        );
                    },
                },
            },
        },
    ],
};

export const IndexSeoInitialFormInputs = {
    ...SeoInitialFormInputs,
    fields: [
        ...SeoInitialFormInputs.fields,
        {
            keyId: 'input-indexed',
            style: { xs: 12, sm: 4, md: 2, sx: { display: 'flex', alignItems: 'center' } },
            input: ({ formCrud }) => {
                return {
                    name: 'seo.indexed',
                    label: formCrud?.infos?.seoIndexedLabel || 'Indexer sur le site ?',
                    inputType: 'switch',
                    sx: { marginTop: 11 },
                };
            },
        },
    ],
};

export const SEOForm = ({ values, setFieldValue, handleChange, handleBlur, touched, errors }) => {
    return (
        <Component.CmtFormBlock title="SEO & Social Media">
            <Box sx={{ marginBlock: 3 }}>
                <Typography>Si les champs suivants sont laissés vides, ils seront automatiquement générés à l'enregistrement à partir des champs titre et description.</Typography>
                <Typography>
                    Le texte saisi dans le champ URL sera transformé au bon format (retrait des accents, mise en minuscules, remplacement des espaces par des tirets...)
                </Typography>
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Component.CmtImage
                        label="Social Image"
                        id={`seo-socialImage`}
                        name={`seo.socialImage`}
                        image={values.seo?.socialImage}
                        setFieldValue={setFieldValue}
                        touched={touched?.seo?.socialImage}
                        errors={errors?.seo?.socialImage}
                        width={'25%'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Component.CmtTextField
                        label="Meta titre"
                        name={`seo.metaTitle`}
                        value={values.seo?.metaTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched?.seo?.metaTitle && errors?.seo?.metaTitle}
                        inputProps={{
                            maxLength: 86,
                        }}
                        onFocus={handleBlur}
                        helperText={
                            touched?.seo?.metaTitle && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography>{values?.seo?.metaTitle?.length} / 86</Typography>
                                </Box>
                            )
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Component.CmtTextField
                        label="Meta description"
                        name={`seo.metaDescription`}
                        value={values.seo?.metaDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched?.seo?.metaDescription && errors?.seo?.metaDescription}
                        onFocus={handleBlur}
                        inputProps={{
                            maxLength: 220,
                        }}
                        helperText={
                            touched?.seo?.metaDescription && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography>{values?.seo?.metaDescription?.length} / 220</Typography>
                                </Box>
                            )
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Component.CmtTextField
                        label="Titre Facebook"
                        name={`seo.fbTitle`}
                        value={values.seo?.fbTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleBlur}
                        error={touched?.seo?.fbTitle && errors?.seo?.fbTitle}
                        inputProps={{
                            maxLength: 74,
                        }}
                        helperText={
                            touched?.seo?.fbTitle && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography>{values?.seo?.fbTitle?.length} / 74</Typography>
                                </Box>
                            )
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Component.CmtTextField
                        label="Description Facebook"
                        name={`seo.fbDescription`}
                        value={values.seo?.fbDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleBlur}
                        error={touched?.seo?.fbDescription && errors?.seo?.fbDescription}
                        inputProps={{
                            maxLength: 160,
                        }}
                        helperText={
                            touched?.seo?.fbDescription && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography>{values?.seo?.fbDescription?.length} / 160</Typography>
                                </Box>
                            )
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Component.CmtTextField
                        label="Titre Twitter"
                        name={`seo.twTitle`}
                        value={values.seo?.twTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleBlur}
                        error={touched?.seo?.twTitle && errors?.seo?.twTitle}
                        inputProps={{
                            maxLength: 60,
                        }}
                        helperText={
                            touched?.seo?.twTitle && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography>{values?.seo?.twTitle?.length} / 60</Typography>
                                </Box>
                            )
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Component.CmtTextField
                        label="Description Twitter"
                        name={`seo.twDescription`}
                        value={values.seo?.twDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleBlur}
                        error={touched?.seo?.twDescription && errors?.seo?.twDescription}
                        inputProps={{
                            maxLength: 142,
                        }}
                        helperText={
                            touched?.seo?.twDescription && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography>{values?.seo?.twDescription?.length} / 142</Typography>
                                </Box>
                            )
                        }
                    />
                </Grid>
            </Grid>
        </Component.CmtFormBlock>
    );
};
