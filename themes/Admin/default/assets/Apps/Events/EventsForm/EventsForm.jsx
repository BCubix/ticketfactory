import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Box } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { Tab } from '@/AdminService/Tab';
import { constructInitialValues } from '@Services/utils/constructInitialValues';

const validationSchema = {
    name: Yup.string().required("Veuillez renseigner le nom de l'évènement.").max(250, "Le nom de l'évènement est trop long"),
    chapo: Yup.string().required('Veuillez renseigner le chapô.'),
    eventCategories: Yup.array().min(1, 'Veuillez renseigner au moins une catégorie.'),
    mainCategory: Yup.string().required('Veuillez renseigner la catégorie principale.'),
    description: Yup.string().required('Veuillez renseigner une description.'),
    eventDateBlocks: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().required('Veuillez renseigner le nom du bloc.').max(250, 'Le nom du bloc est trop long'),
                eventDates: Yup.array()
                    .of(
                        Yup.object().shape({
                            eventDate: Yup.string().required('Veuillez renseigner la date.'),
                            state: Yup.string().required('Veuillez renseigner le status de cette date.'),
                            reportDate: Yup.string().when('state', (state) => {
                                if (state === 'delayed') {
                                    return Yup.string().required('Veuillez renseigner la nouvelle date.');
                                } else {
                                    return Yup.string().nullable();
                                }
                            }),
                        })
                    )
                    .min(1, 'Veuillez renseigner au moins une date.'),
            })
        )
        .min(1, 'Veuillez renseigner au moins un bloc de dates.'),
    eventPriceBlocks: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Veuillez renseigner le nom du bloc.').max(250, 'Le nom du bloc est trop long'),
            eventPrices: Yup.array()
                .of(
                    Yup.object().shape({
                        name: Yup.string().required('Veuillez renseigner le nom du tarif.'),
                        price: Yup.number().required('Veuillez renseigner le prix').min(0, 'Veuillez renseigner un prix valide.'),
                    })
                )
                .min(1, 'Veuillez renseigner au moins un prix.'),
        })
    ),
};

const initialSchema = {
    active: (initValues) => initValues?.active || false,
    name: (initValues) => initValues?.name || '',
    chapo: (initValues) => initValues?.chapo || '',
    description: (initValues) => initValues?.description || '',
    eventDateBlocks: (initValues) =>
        initValues?.eventDateBlocks?.map((el) => ({
            ...el,
            lang: el?.lang?.id || '',
            eventDates: el.eventDates?.map((date) => ({ ...date, lang: date.lang.id || '' })),
        })) || [{ name: 'Dates', eventDates: [], lang: initValues?.lang?.id || '' }],
    eventPriceBlocks: (initValues) =>
        initValues?.eventPriceBlocks?.map((el) => ({
            ...el,
            lang: el?.lang?.id || '',
            eventPrices: el?.eventPrices?.map((price) => ({ ...price, lang: price?.lang?.id || '' })),
        })) || [{ name: 'Tarifs', eventPrices: [], lang: initValues?.lang?.id || '' }],
    eventCategories: (initValues, { categoriesList }) => (initValues?.eventCategories ? initValues?.eventCategories?.map((el) => el.id) : [categoriesList.id]),
    room: (initValues) => initValues?.room?.id || '',
    season: (initValues) => initValues?.season?.id || '',
    tags: (initValues) => (initValues?.tags ? initValues?.tags?.map((el) => el.id) : []),
    mainCategory: (initValues, { categoriesList }) => initValues?.mainCategory?.id || categoriesList.id,
    multiplePriceBlock: (initValues) => initValues?.eventPriceBlocks?.length > 1 || false,
    multipleDateBlock: (initValues) => initValues?.eventDateBlocks?.length > 1 || false,
    eventMedias: (initValues) =>
        initValues?.eventMedias?.map((el) => ({
            position: el.position,
            id: el.media?.id,
            media: el.media,
        })) || [],
    slug: (initValues) => initValues?.slug || '',
    editSlug: false,
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    ticketingId: (initValues) => initValues?.ticketingId || '',
    useThirdPartyTicketing: (initValues) => initValues?.useThirdPartyTicketing || false,
    thirdPartyTicketingUrl: (initValues) => initValues?.thirdPartyTicketingUrl || '',
    eventLength: (initValues) => initValues?.eventLength || '',
    seo: {
        metaTitle: (initValues) => initValues?.metaTitle || '',
        metaDescription: (initValues) => initValues?.metaDescription || '',
        socialImage: (initValues) => initValues?.socialImage || null,
        fbTitle: (initValues) => initValues?.fbTitle || '',
        fbDescription: (initValues) => initValues?.fbDescription || '',
        twTitle: (initValues) => initValues?.twTitle || '',
        twDescription: (initValues) => initValues?.twDescription || '',
    },
};

const LIST = {
    form: {
        initialSchema: initialSchema,
        validationSchema: validationSchema,
    },
    components: [
        {
            keyId: 'form',
            component: (props) => <EventsForm {...props} />,

            children: [
                {
                    keyId: 'event-form-tabs',
                    component: (props) => <CmtTabs {...props} />,
                },
                {
                    keyId: 'event-form-validation',
                    component: (props) => <CmtTabs {...props} />,
                },
            ],
        },
    ],
};

export const EventsForm = ({ handleSubmit, initialValues = null, translateInitialValues = null, categoriesList, roomsList, seasonsList, tagsList }) => {
    const initValues = translateInitialValues || initialValues;

    if (!categoriesList || !roomsList || !seasonsList || !tagsList) {
        return <></>;
    }

    return (
        <Formik
            initialValues={constructInitialValues(initialSchema, initValues, { categoriesList, roomsList, seasonsList, tagsList })}
            validationSchema={Yup.object().shape(LIST.form.validationSchema)}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);

                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, setFieldTouched, setFieldValue, handleBlur, handleSubmit, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un évènement`}>
                    <Component.CmtTabs
                        containerStyle={{ mt: 3 }}
                        list={Tab.EventsFormTabList({
                            values,
                            handleChange,
                            handleBlur,
                            touched,
                            errors,
                            setFieldTouched,
                            setFieldValue,
                            roomsList,
                            seasonsList,
                            categoriesList,
                            tagsList,
                            initialValues: initValues,
                            editMode: Boolean(initialValues),
                        })}
                    />

                    <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Evènement actif ?" />

                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
