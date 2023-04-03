import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';

import { Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

import { Component } from '@/AdminService/Component';
import { Api } from '@/AdminService/Api';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { Constant } from '@/AdminService/Constant';

const EditValidateIcon = ({ editMode, name, handleSubmit, handleSetEditMode, setFieldValue }) => {
    return (
        <IconButton
            aria-label="edit"
            onClick={() => {
                if (editMode) {
                    setFieldValue('submittedInput', name);
                    handleSubmit({ name: name });
                } else {
                    handleSetEditMode({ [name]: true });
                }
            }}
        >
            {editMode ? <DoneIcon sx={{ color: (theme) => theme.palette.crud.create.textColor }} /> : <EditIcon sx={{ color: (theme) => theme.palette.crud.action.textColor }} />}
        </IconButton>
    );
};

export const CmtDisplayMediaInfos = ({ selectedMedia, displayImage = false, displayMeta = false, updatedMedia = null }) => {
    const dispatch = useDispatch();
    const selectedMediaId = useRef(selectedMedia?.id);
    const [editMode, setEditMode] = useState({
        title: false,
        alt: false,
        legend: false,
    });

    const mediaSchema = Yup.object().shape({
        title: Yup.string().required('Veuillez renseigner le titre du fichier'),
    });

    const handleSetEditMode = (mode) => {
        const newValue = { ...editMode, ...mode };
        setEditMode(newValue);
    };

    useEffect(() => {
        if (selectedMediaId.current !== selectedMedia?.id) {
            setEditMode({ title: false, alt: false, legend: false });
        }

        selectedMediaId.current = selectedMedia?.id;
    }, [selectedMedia]);

    const handleChangeMediaInfos = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.editMedia(selectedMedia?.id, { ...selectedMedia, [values.submittedInput]: values[values.submittedInput] });

            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            if (updatedMedia) {
                updatedMedia(result.media);
            }
        });
    };

    return (
        <Formik
            initialValues={{ title: selectedMedia?.title || '', alt: selectedMedia?.alt || '', legend: selectedMedia?.legend || '', submittedInput: '' }}
            validationSchema={mediaSchema}
            onSubmit={async (values, { setSubmitting }) => {
                if (!values.submittedInput) {
                    return;
                }

                await handleChangeMediaInfos(values);
                handleSetEditMode({ [values.submittedInput]: false });
                setSubmitting(false);
            }}
            enableReinitialize
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                <Box>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        {editMode.title ? (
                            <Component.CmtTextField
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Titre"
                                name="title"
                                error={touched.title && errors.title}
                                required
                            />
                        ) : (
                            <Box width="100%">
                                <Typography fontSize={10} variant="body2">
                                    Titre
                                </Typography>
                                <Typography variant="body1">{selectedMedia?.title}</Typography>
                            </Box>
                        )}

                        <EditValidateIcon editMode={editMode.title} name="title" handleSubmit={handleSubmit} handleSetEditMode={handleSetEditMode} setFieldValue={setFieldValue} />
                    </Box>

                    {selectedMedia?.realType === 'image' && (
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                            {editMode.alt ? (
                                <Component.CmtTextField
                                    value={values.alt}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Texte alternatif"
                                    name="alt"
                                    error={touched.alt && errors.alt}
                                />
                            ) : (
                                <Box width="100%">
                                    <Typography fontSize={10} variant="body2">
                                        Texte alternatif
                                    </Typography>
                                    <Typography variant="body1">{selectedMedia?.alt || '-'}</Typography>
                                </Box>
                            )}

                            <EditValidateIcon editMode={editMode.alt} name="alt" handleSubmit={handleSubmit} handleSetEditMode={handleSetEditMode} setFieldValue={setFieldValue} />
                        </Box>
                    )}

                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        {editMode.legend ? (
                            <Component.CmtTextField
                                value={values.legend}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Légende"
                                name="legend"
                                error={touched.legend && errors.legend}
                            />
                        ) : (
                            <Box width="100%">
                                <Typography fontSize={10} variant="body2">
                                    Légende
                                </Typography>
                                <Typography variant="body1">{selectedMedia?.legend || '-'}</Typography>
                            </Box>
                        )}

                        <EditValidateIcon
                            editMode={editMode.legend}
                            name="legend"
                            handleSubmit={handleSubmit}
                            handleSetEditMode={handleSetEditMode}
                            setFieldValue={setFieldValue}
                        />
                    </Box>

                    {displayImage && (
                        <Box display="flex" justifyContent={'center'}>
                            <Box my={10} maxWidth={'100%'} maxHeight={'300px'} display="flex" justifyContent="center" position={'relative'}>
                                <Component.CmtDisplayMediaType media={selectedMedia} maxWidth={'100%'} maxHeight={'300px'} />
                            </Box>
                        </Box>
                    )}

                    {displayMeta && <Component.CmtDisplayMediaMeta selectedMedia={selectedMedia} />}
                </Box>
            )}
        </Formik>
    );
};

export const CmtDisplayMediaMeta = ({ selectedMedia }) => {
    return (
        <Grid container spacing={4} sx={{ my: 3 }}>
            <Grid item xs={12} sm={6} sx={{ mb: 3 }}>
                <Typography fontSize={10} variant="body2">
                    Crée le
                </Typography>
                <Typography variant="body1">{moment(selectedMedia?.createdAt).format('DD-MM-YYYY')}</Typography>
            </Grid>

            {selectedMedia?.updatedAt && (
                <Grid item xs={12} sm={6} sx={{ mb: 3 }}>
                    <Typography fontSize={10} variant="body2">
                        Mis à jour le
                    </Typography>
                    <Typography variant="body1">{moment(selectedMedia?.updatedAt).format('DD-MM-YYYY')}</Typography>
                </Grid>
            )}

            <Grid item xs={12} sm={6} sx={{ mb: 3 }}>
                <Typography fontSize={10} variant="body2">
                    Type de fichier
                </Typography>
                <Typography variant="body1">{selectedMedia?.documentType}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 3 }}>
                <Typography fontSize={10} variant="body2">
                    Nom du fichier
                </Typography>
                <Typography variant="body1">{selectedMedia?.documentFileName || '-'}</Typography>
            </Grid>
        </Grid>
    );
};
