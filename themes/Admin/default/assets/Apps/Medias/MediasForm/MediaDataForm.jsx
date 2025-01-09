import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Grid, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';
import { getMediaType } from '@Services/utils/getMediaType';

const GeneralInformation = ({ values, media, handleChange, setFieldValue, errors, touched, handleBlur, mediaType, setEditImage }) => (
    <Grid container spacing={4} sx={{ marginTop: 3 }}>
        <Grid item xs={12} sm={6} md={4} container spacing={4}>
            <Grid item xs={12}>
                <InputLabel sx={{ fontSize: 12 }}>Aperçu</InputLabel>
                <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Component.CmtDisplayMediaType media={media} width={'auto'} height={'auto'} maxHeight="250px" maxWidth="100%" />
                    {mediaType === 'image' && (
                        <Component.SpecialActionButton variant="contained" sx={{ mt: 5 }} onClick={() => setEditImage(true)}>
                            Modifier l'image
                        </Component.SpecialActionButton>
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
            {getMediaType(values.documentType) === 'image' && (
                <Grid item xs={12}>
                    <Component.CmtTextField value={values.alt} onChange={handleChange} onBlur={handleBlur} label="Texte alternatif" name="alt" error={touched.alt && errors.alt} />
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

const Categories = ({ values, setFieldValue, errors, touched, mediaCategoriesList }) => (
    <Grid container spacing={4} sx={{ marginTop: 3 }}>
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
    </Grid>
);

export const MediaDataForm = ({ media, handleSubmit, deleteElement, mediaCategoriesList, mediaType, setEditImage, imageFormatList, userDeleteRight }) => {
    const mediaSchema = Yup.object().shape({
        title: Yup.string().required('Veuillez renseigner le titre du fichier'),
    });

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                alt: media?.alt || '',
                title: media?.title || '',
                legend: media?.legend || '',
                active: media?.active || false,
                mainCategory: media?.mainCategory?.id || '',
                thumbnail: media?.thumbnail || null,
                documentType: media?.documentType || '',
                mediaCategories: media?.mediaCategories ? media?.mediaCategories?.map((el) => el.id) : [],
                realThumbnail: media?.realThumbnail || '',
                imageFormats: media?.imageFormats ? media?.imageFormats?.map((el) => el.id) : [],
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
                        containerStyle={{ width: '100%' }}
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
                                label: 'Catégories',
                                id: 'categories',
                                component: <Categories values={values} setFieldValue={setFieldValue} errors={errors} touched={touched} mediaCategoriesList={mediaCategoriesList} />,
                            },
                            {
                                label: 'Emplacements',
                                id: 'locations',
                                component: <Formats values={values} setFieldValue={setFieldValue} touched={touched} errors={errors} imageFormatList={imageFormatList} />,
                                hidden: !['image', 'audio', 'video'].includes(media?.realType),
                            },
                        ]}
                    />

                    <Box display="flex" sx={{ mb: 5, mt: 4 }}>
                        {userDeleteRight && (
                            <Button id="deleteButton" color="error" onClick={deleteElement}>
                                Supprimer l'element
                            </Button>
                        )}

                        <Box display={'flex'} sx={{ pb: 3, pt: 5, ml: 'auto' }} alignItems="center">
                            <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Média actif ?" mr={0} />
                            <Button id="submitForm" type="submit" variant="contained" sx={{ ml: 3 }} disabled={isSubmitting}>
                                Modifier
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Formik>
    );
};
