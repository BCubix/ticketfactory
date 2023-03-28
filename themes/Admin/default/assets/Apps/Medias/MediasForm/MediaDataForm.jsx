import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import { Button, Grid, InputLabel } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { getMediaType } from '@Services/utils/getMediaType';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Api } from '@/AdminService/Api';

const GeneralInformation = ({ values, media, handleChange, setFieldValue, errors, touched, setFieldTouched, handleBlur, mediaType, setEditImage }) => {
    return (
        <Grid container spacing={4} sx={{ marginTop: 3 }}>
            <Grid item xs={12} sm={6} md={4} container spacing={4}>
                <Grid item xs={12}>
                    <InputLabel sx={{ fontSize: 12 }}>Aperçu</InputLabel>
                    <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Component.CmtDisplayMediaType media={media} width={'auto'} height={'auto'} maxHeight="250px" maxWidth="100%" />
                        {mediaType === 'image' && (
                            <Button sx={{ mt: 5 }} variant={'contained'} color="primary" onClick={() => setEditImage(true)}>
                                Modifier l'image
                            </Button>
                        )}
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
                <Grid item xs={12}>
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

export const MediaDataForm = ({ media, handleSubmit, deleteElement, mediaCategoriesList, mediaType, setEditImage }) => {
    const dispatch = useDispatch();
    const [mediasList, setMediasList] = useState(null);
    const [mediasFilters, setMediasFilters] = useState({
        title: '',
        active: null,
        iframe: null,
        type: '',
        category: '',
        sort: 'id DESC',
        page: 1,
        limit: 20,
    });

    const getMediasList = () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMediasList({ ...mediasFilters });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }
            setMediasList(result);
        });
    };

    useEffect(() => {
        getMediasList();
    }, [mediasFilters]);

    const mediaSchema = Yup.object().shape({
        title: Yup.string().required('Veuillez renseigner le titre du fichier'),
    });

    return (
        <Formik
            initialValues={{
                alt: media?.alt || '',
                title: media?.title || '',
                subtitle: media?.subtitle || '',
                legend: media?.legend || '',
                description: media?.description || '',
                active: media?.active || false,
                mainCategory: media?.mainCategory?.id || '',
                documentType: media?.documentType || '',
                mediaCategories: media?.mediaCategories ? media?.mediaCategories?.map((el) => el.id) : [],
                thumbnail: media?.thumbnail || null,
                realThumbnail: media?.realThumbnail || '',
            }}
            validationSchema={mediaSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit({ ...media, ...values });

                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Box component="form" onSubmit={handleSubmit} sx={{ margin: 5, width: '100%' }}>
                    <Component.CmtTabs
                        list={[
                            {
                                label: 'Informations générales',
                                id: 'generalInformations',
                                component: (
                                    <GeneralInformation
                                        values={values}
                                        media={media}
                                        handleChange={handleChange}
                                        setFieldValue={setFieldValue}
                                        errors={errors}
                                        touched={touched}
                                        setFieldTouched={setFieldTouched}
                                        handleBlur={handleBlur}
                                        mediaType={mediaType}
                                        setEditImage={setEditImage}
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
                        ]}
                    />

                    <Box display={'flex'} justifyContent="flex-end" sx={{ pb: 3, pt: 5 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Média actif ?" mr={0} />
                    </Box>

                    <Box display="flex" justifyContent={'flex-end'} sx={{ mb: 5, mt: 2 }}>
                        <Button id="deleteButton" color="error" onClick={deleteElement} sx={{ mt: 3, mb: 2, mr: 'auto' }}>
                            Supprimer l'element
                        </Button>

                        <Button id="submitForm" type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
                            Modifier
                        </Button>
                    </Box>
                </Box>
            )}
        </Formik>
    );
};
