import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Grid, InputLabel, FormControl, FormControlLabel, Checkbox } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';
import { getMediaType } from '@Services/utils/getMediaType';
import { useDispatch, useSelector } from 'react-redux';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Api } from '@/AdminService/Api';

const GeneralInformation = ({ values, media, handleChange, setFieldValue, errors, touched, handleBlur, mediaType, setEditImage }) => (
    <Grid container spacing={4} sx={{ marginTop: 3 }}>
        <Grid item xs={12} sm={6} container spacing={4}>
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
                <Component.CmtDisplayMediaMeta selectedMedia={media} />
            </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container spacing={4}>
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

const Formats = ({ mediaParameterList, setMediaFormatList, values, setFieldValue }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            Api.imageFormatsApi.getAllImageFormat({ active: true }).then((result) => {
                if (result.result) {
                    setList(result.imageFormat);
                } else {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur');
                }
            });
        });
    }, [dispatch]);

    const handleCheckboxChange = (item) => {
        var arrayList = mediaParameterList.replace(/\s+/g, '').split(',');
        var imageFormats = [...values?.imageFormats];
        var indexValue = arrayList.indexOf(item.id.toString());
        var idListImageFormat = list.map((el) => el.id);

        if (indexValue !== -1) {
            arrayList.splice(indexValue, 1);
            imageFormats = imageFormats?.filter((imageFormat) => imageFormat.id !== item.id);
            setFieldValue('imageFormats', imageFormats);
        } else {
            arrayList.push(item.id.toString());
            imageFormats.push(list[idListImageFormat.indexOf(item.id)]);

            setFieldValue('imageFormats', imageFormats);

            if (!values.imageFormats) {
                setFieldValue('imageFormats', item.id);
            }
        }
        console.log(imageFormats);
        setMediaFormatList(arrayList.toString());
    };

    return (
        <Grid container spacing={2}>
            <FormControl fullWidth sx={{ marginBlock: 3, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                {list.map((item) => (
                    <Grid item key={item.id}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mediaParameterList ? mediaParameterList.replace(/\s+/g, '').split(',').includes(String(item.id)) : false}
                                    onChange={() => handleCheckboxChange(item)}
                                    value={item.id}
                                    name={item.name}
                                    color="primary"
                                />
                            }
                            label={item.name}
                        />
                    </Grid>
                ))}
            </FormControl>
        </Grid>
    );
};

const Categories = ({ values, setFieldValue, errors, touched, mediaCategoriesList }) => (
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
);

export const MediaDataForm = ({ media, handleSubmit, deleteElement, mediaCategoriesList, mediaType, setEditImage, mediaParameterList, setMediaFormatList }) => {
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
                documentType: media?.documentType || '',
                mediaCategories: media?.mediaCategories ? media?.mediaCategories?.map((el) => el.id) : [],
                realThumbnail: media?.realThumbnail || '',
                imageFormats: media?.imageFormats ? media?.imageFormats : [],
            }}
            validationSchema={mediaSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit({ ...media, ...values });
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
                                label: 'Formats',
                                id: 'formats',
                                component: (
                                    <Formats mediaParameterList={mediaParameterList} setMediaFormatList={setMediaFormatList} values={values} setFieldValue={setFieldValue} />
                                ),
                            },
                        ]}
                    />
                    <Box display="flex" sx={{ mb: 5, mt: 4 }}>
                        <Button id="deleteButton" color="error" onClick={deleteElement}>
                            Supprimer l'element
                        </Button>
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
