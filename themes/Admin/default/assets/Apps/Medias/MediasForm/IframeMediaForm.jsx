import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/system';

import { getMediaType } from '@Services/utils/getMediaType';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Button, FormControl, FormHelperText, Grid, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';

const IFRAME_TYPE = [
    { label: 'Image', value: 'image/jpeg' },
    { label: 'Audio', value: 'audio/mpeg' },
    { label: 'video', value: 'video/mp4' },
];

const GeneralInformation = ({ values, handleChange, setFieldValue, errors, touched, setFieldTouched, handleBlur }) => {
    return (
        <Grid container spacing={4} sx={{ marginTop: 3 }}>
            <Grid item xs={12} sm={6} md={4} container spacing={4}>
                <Grid item xs={12}>
                    <InputLabel sx={{ fontSize: 12 }}>Aperçu</InputLabel>
                    <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Component.CmtDisplayMediaType media={values} width={'auto'} height={'auto'} maxHeight="250px" maxWidth="100%" />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Component.CmtImage
                        label="Vignette"
                        id={`thumbnail`}
                        name={`thumbnail`}
                        image={values.thumbnail}
                        setFieldValue={setFieldValue}
                        touched={touched?.thumbnail}
                        errors={errors?.thumbnail}
                        width={'100%'}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={8} container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Component.CmtTextField
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Titre"
                        name="title"
                        error={touched.title && errors.title}
                        sx={{ mt: 5 }}
                        required
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Component.CmtSelect
                        {...{ setFieldValue, name }}
                        label={'Type de média'}
                        required
                        id={`choice-documentType`}
                        value={values?.documentType || ''}
                        handleBlur={handleBlur}
                        name={'documentType'}
                        list={IFRAME_TYPE}
                        touched={touched?.documentType}
                        errors={errors?.documentType}
                        getValue={(item) => item?.value}
                        getName={(item) => item?.label}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Component.CmtTextField
                        value={values.subtitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Sous titre"
                        name="subtitle"
                        error={touched.subtitle && errors.subtitle}
                        sx={{ mt: 5 }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Component.CmtTextField
                        value={values.documentUrl}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Url youtube ou balise iframe"
                        name="documentUrl"
                        error={touched.documentUrl && errors.documentUrl}
                        sx={{ mt: 3 }}
                        required
                    />
                </Grid>

                {getMediaType(values.documentType) === 'image' && (
                    <Grid item xs={12}>
                        <Component.CmtTextField
                            value={values.alt}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Texte alternatif"
                            name="alt"
                            error={touched.alt && errors.alt}
                        />
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Component.CmtTextField
                        value={values.legend}
                        multiline
                        rows={3}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Légende"
                        name="legend"
                        error={touched.legend && errors.legend}
                        sx={{ mt: 3 }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

const Description = ({ values, setFieldValue, setFieldTouched, errors, touched }) => {
    return (
        <Grid container spacing={4} sx={{ marginTop: 3 }}>
            <Grid item xs={12}>
                <Component.CmtEditorField
                    label="Description"
                    name={`description`}
                    value={values.description}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    errors={touched.description && errors.description}
                />
            </Grid>
        </Grid>
    );
};

const Categories = ({ values, setFieldValue, errors, touched, mediaCategoriesList }) => {
    return (
        <>
            <Grid item xs={12}>
                <Component.MediaParentCategoryPartForm
                    sx={{ mt: 3 }}
                    values={values}
                    mediaCategoriesList={mediaCategoriesList}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    errors={errors}
                />
            </Grid>
        </>
    );
};

const Formats = ({ values, setFieldValue, touched, errors, imageFormatList }) => {
    return (
        <Grid container spacing={4} sx={{ marginTop: 3 }}>
            <Grid item xs={12}>
                <Component.CmtSelectField
                    label="Emplacements"
                    multiple
                    name={`imageFormats`}
                    value={values.imageFormats}
                    list={imageFormatList}
                    getValue={(item) => item?.id}
                    getName={(item) => item?.name}
                    setFieldValue={setFieldValue}
                    errors={touched.imageFormats && errors.imageFormats}
                />
            </Grid>
        </Grid>
    );
};

export const IframeMediaForm = ({ handleSubmit, onCancel, imageFormatList = [], id = null, deleteElement = null }) => {
    const dispatch = useDispatch();
    const [media, setMedia] = useState(null);
    const [mediaCategoriesList, setMediaCategoriesList] = useState(null);

    const getMedia = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getOneMedia(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                onCancel();
                return;
            }

            setMedia(result.media);
        });
    };

    useEffect(() => {
        setMedia(null);

        if (!id) {
            return;
        }

        getMedia();
    }, [id]);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.getAllMediaCategories();
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                onCancel();
            }

            setMediaCategoriesList(result.mediaCategories);
        });
    }, []);

    const mediaSchema = Yup.object().shape({
        title: Yup.string().required('Veuillez renseigner le titre du média'),
        documentUrl: Yup.string().required("Veuillez renseigner l'url du média"),
        documentType: Yup.string().required('Veuillez renseigner le type du média'),
    });

    if ((!media && id) || !mediaCategoriesList) {
        return <></>;
    }

    return (
        <Formik
            initialValues={{
                title: media?.title || '',
                subtitle: media?.subtitle || '',
                alt: media?.alt || '',
                legend: media?.legend || '',
                description: media?.description || '',
                active: media?.active || false,
                mainCategory: media?.mainCategory?.id || '',
                mediaCategories: media?.mediaCategories ? media?.mediaCategories?.map((el) => el.id) : [],
                documentUrl: media?.documentUrl || '',
                documentType: media?.documentType || '',
                thumbnail: media?.thumbnail || null,
                realThumbnail: media?.realThumbnail || '',
                imageFormats: media?.imageFormats ? media?.imageFormats?.map((el) => el.id) : [],
                iframe: true,
            }}
            validationSchema={mediaSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Box component="form" onSubmit={handleSubmit} sx={{ margin: 5 }}>
                    <Component.CmtTabs
                        list={[
                            {
                                label: 'Informations générales',
                                id: 'generalInformations',
                                component: (
                                    <GeneralInformation
                                        values={values}
                                        handleChange={handleChange}
                                        setFieldValue={setFieldValue}
                                        errors={errors}
                                        touched={touched}
                                        setFieldTouched={setFieldTouched}
                                        handleBlur={handleBlur}
                                    />
                                ),
                            },
                            {
                                label: 'Description',
                                id: 'description',
                                component: <Description values={values} setFieldValue={setFieldValue} errors={errors} touched={touched} setFieldTouched={setFieldTouched} />,
                            },
                            {
                                label: 'Catégories',
                                id: 'categories',
                                component: <Categories values={values} setFieldValue={setFieldValue} errors={errors} touched={touched} mediaCategoriesList={mediaCategoriesList} />,
                            },
                            {
                                label: 'Emplacements',
                                id: 'locations',
                                component: <Formats values={values} setFieldValue={setFieldValue} touched={touched} errors={errors} imageFormatList={imageFormatList} />,
                            },
                        ]}
                    />

                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Box display={'flex'} justifyContent="flex-end" sx={{ pb: 3, pt: 5 }}>
                                <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Média actif ?" mr={0} />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" justifyContent={'flex-end'} sx={{ mb: 5, mt: 2 }}>
                                {id ? (
                                    <Button id="deleteButton" color="error" onClick={() => deleteElement(id)} sx={{ mt: 3, mb: 2, mr: 'auto' }}>
                                        Supprimer l'element
                                    </Button>
                                ) : (
                                    <Button id="cancelButton" color="error" onClick={onCancel} sx={{ mt: 3, mb: 2, mr: 'auto' }}>
                                        Annuler
                                    </Button>
                                )}

                                <Button id="submitForm" type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
                                    Modifier
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Formik>
    );
};
