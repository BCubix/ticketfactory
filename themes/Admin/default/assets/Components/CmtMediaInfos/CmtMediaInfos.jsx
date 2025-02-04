import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment/moment';
import { Box } from '@mui/system';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

import { Component } from '@/AdminService/Component';
import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getMediaType } from '@Services/utils/getMediaType';

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

export const CmtDisplayMediaInfos = ({
    selectedMedia,
    displayImage = false,
    displayMeta = false,
    displaySelectButton = true,
    startUpdatingMedia = null,
    endUpdatingMedia = null,
    updatedMedia = null,
    onClickDisplayFullImage = null,
    imageFormatList,
    isSelected,
    name,
    onClick,
    setFieldValue,
    AddMediaLabel,
    RemoveMediaLabel,
    wrapperClasses = 'padding-inline-5 padding-bottom-5',
}) => {
    const dispatch = useDispatch();
    const selectedMediaId = useRef(selectedMedia?.id);
    const [editMode, setEditMode] = useState({
        title: false,
        alt: false,
        legend: false,
        imageFormats: false,
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
            setEditMode({ title: false, alt: false, legend: false, imageFormats: false });
        }

        selectedMediaId.current = selectedMedia?.id;
    }, [selectedMedia]);

    const handleChangeMediaInfos = async (values) => {
        apiMiddleware(dispatch, async () => {
            if (startUpdatingMedia) {
                startUpdatingMedia({ ...selectedMedia, [values.submittedInput]: values[values.submittedInput] });
            }

            const result = await Api.mediasApi.editMedia(selectedMedia?.id, { ...selectedMedia, [values.submittedInput]: values[values.submittedInput] });

            if (endUpdatingMedia) {
                endUpdatingMedia(result);
            }

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
            initialValues={{
                title: selectedMedia?.title || '',
                alt: selectedMedia?.alt || '',
                legend: selectedMedia?.legend || '',
                submittedInput: '',
                imageFormats: selectedMedia?.imageFormats ? selectedMedia?.imageFormats?.map((el) => el.id) : [],
            }}
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
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue: setMediaFieldValue }) => (
                <Box className={wrapperClasses}>
                    <Component.CmtMediaInfoBlock>
                        <Box>
                            <Typography variant="h3">Emplacements</Typography>
                        </Box>

                        <Box sx={{ mb: 3, pt: 4, display: 'flex', alignItems: 'center' }}>
                            {editMode.imageFormats ? (
                                <Component.CmtSelectField
                                    label="Emplacements"
                                    multiple
                                    name={`imageFormats`}
                                    value={values?.imageFormats}
                                    list={imageFormatList || []}
                                    getValue={(item) => item?.id}
                                    getName={(item) => item?.name}
                                    setFieldValue={setMediaFieldValue}
                                    errors={touched.imageFormats && errors.imageFormats}
                                />
                            ) : (
                                <Box width="100%">
                                    <Typography variant="body1">{selectedMedia?.imageFormats.map((format) => format.name).join(' - ')}</Typography>
                                </Box>
                            )}

                            <EditValidateIcon
                                editMode={editMode.imageFormats}
                                name="imageFormats"
                                handleSubmit={handleSubmit}
                                handleSetEditMode={handleSetEditMode}
                                setFieldValue={setMediaFieldValue}
                            />
                        </Box>

                        {displaySelectButton && (
                            <Box className="flex row-center padding-top-3">
                                <Button
                                    variant={isSelected ? 'outlined' : 'contained'}
                                    color={isSelected ? 'error' : 'primary'}
                                    id="add-remove-media"
                                    onClick={() => {
                                        if (null !== onClick) {
                                            onClick(selectedMedia);
                                        } else {
                                            if (isSelected) {
                                                setFieldValue(name, null);
                                            } else {
                                                setFieldValue(name, selectedMedia);
                                            }
                                        }
                                    }}
                                >
                                    {isSelected ? RemoveMediaLabel : AddMediaLabel} le média
                                </Button>
                            </Box>
                        )}
                    </Component.CmtMediaInfoBlock>

                    {displayImage && (
                        <Component.CmtMediaInfoBlock>
                            <Box>
                                <Typography variant="h3">Aperçu</Typography>
                            </Box>
                            <Box display="flex" justifyContent={'center'}>
                                <Box
                                    mb={5}
                                    mt={5}
                                    maxWidth={'100%'}
                                    maxHeight={'300px'}
                                    display="flex"
                                    justifyContent="center"
                                    position={'relative'}
                                    onClick={() => {
                                        if (getMediaType(selectedMedia?.documentType) === 'image' && onClickDisplayFullImage) {
                                            onClickDisplayFullImage(selectedMedia);
                                        }
                                    }}
                                    className={getMediaType(selectedMedia?.documentType) === 'image' && onClickDisplayFullImage ? 'image-fullscreen-trigger-container' : ''}
                                >
                                    <Component.CmtDisplayMediaType media={selectedMedia} maxWidth={'100%'} maxHeight={'300px'} />
                                </Box>
                            </Box>
                        </Component.CmtMediaInfoBlock>
                    )}

                    <Component.CmtMediaInfoBlock>
                        <Box>
                            <Typography variant="h3">Propriétés</Typography>
                        </Box>

                        <Box sx={{ mb: 3, mt: 5, display: 'flex', alignItems: 'center' }}>
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
                                    <Typography variant="body1" className="word-break-all">
                                        {selectedMedia?.title}
                                    </Typography>
                                </Box>
                            )}

                            <EditValidateIcon
                                editMode={editMode.title}
                                name="title"
                                handleSubmit={handleSubmit}
                                handleSetEditMode={handleSetEditMode}
                                setFieldValue={setMediaFieldValue}
                            />
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

                                <EditValidateIcon
                                    editMode={editMode.alt}
                                    name="alt"
                                    handleSubmit={handleSubmit}
                                    handleSetEditMode={handleSetEditMode}
                                    setFieldValue={setMediaFieldValue}
                                />
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
                                setFieldValue={setMediaFieldValue}
                            />
                        </Box>
                    </Component.CmtMediaInfoBlock>

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

            <Grid item xs={12} sm={6} sx={{ mb: 3 }}>
                <Typography fontSize={10} variant="body2">
                    Url du média
                </Typography>
                <Typography variant="body1">
                    {Constant.FRONT_URL}
                    {selectedMedia.documentUrl}
                </Typography>
            </Grid>

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
