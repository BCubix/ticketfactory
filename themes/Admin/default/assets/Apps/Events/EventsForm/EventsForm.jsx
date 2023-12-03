import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Box } from '@mui/material';
import { Component } from '@/AdminService/Component';
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
    eventCategories: (initValues, { categoriesList }) => (initValues?.eventCategories ? initValues?.eventCategories?.map((el) => el.id) : [categoriesList?.id]),
    room: (initValues) => initValues?.room?.id || '',
    season: (initValues) => initValues?.season?.id || '',
    tags: (initValues) => (initValues?.tags ? initValues?.tags?.map((el) => el.id) : []),
    mainCategory: (initValues, { categoriesList }) => initValues?.mainCategory?.id || categoriesList?.id,
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
    featureLinks: (initValues) =>
        initValues?.featureLinks
            ? initValues?.featureLinks?.map((el) => ({
                  ...el,
                  event: el?.event?.id,
                  product: el?.product?.id,
                  feature: el?.feature?.id,
                  featureValue: el?.featureValue?.id,
                  featureValueRaw: '',
              }))
            : [],
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

export const LIST = {
    form: {
        initialSchema: initialSchema,
        validationSchema: validationSchema,
    },
    components: [
        {
            keyId: 'tabs',
            component: (props) => <TabsEvent {...props} />,

            tabs: [
                {
                    keyId: 'event-tab',
                    label: 'Evènement',
                    component: (props) => <Component.EventMainPartForm {...props} />,
                },
                {
                    keyId: 'dates-tab',
                    label: 'Dates',
                    component: (props) => <Component.EventsDateBlockForm {...props} />,
                },
                {
                    keyId: 'prices-tab',
                    label: 'Tarifs',
                    component: (props) => <Component.EventsPriceBlockForm {...props} />,
                },
                {
                    keyId: 'features-tab',
                    label: 'Attributs',
                    component: (props) => <Component.EventFeaturesPartForm {...props} />,
                },
                {
                    keyId: 'medias-tab',
                    label: 'Médias',
                    component: (props) => <Component.EventMediaPartForm {...props} />,
                },
            ],
        },
        {
            keyId: 'box',
            component: (props) => <BoxEvent {...props} />,

            children: [
                { keyId: 'active-field', component: (props) => <ActiveFieldEvent {...props} /> },
                { keyId: 'button', component: (props) => <ButtonEvent {...props} /> },
            ],
        },
    ],
};

export const EventsForm = ({ handleSubmit, initialValues = null, translateInitialValues = null, ...props }) => {
    const initValues = translateInitialValues || initialValues;

    if (!props.categoriesList || !props.roomsList || !props.seasonsList || !props.tagsList) {
        return <></>;
    }
    return (
        <Formik
            initialValues={constructInitialValues(LIST.form.initialSchema, initValues, { ...props })}
            validationSchema={Yup.object().shape(LIST.form.validationSchema)}
            translateInitialValues={translateInitialValues}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, setFieldTouched, setFieldValue, handleBlur, handleSubmit, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un évènement`}>
                    <Component.CmtDisplayComponents
                        list={LIST.components}
                        initialValues={initialValues}
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        handleSubmit={handleSubmit}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        isSubmitting={isSubmitting}
                        {...props}
                    />
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};

const TabsEvent = ({ tabs, ...props }) => {
    return <Component.CmtTabs containerStyle={{ mt: 3 }} list={tabs.map((elem) => ({ id: elem.keyId, label: elem.label, component: elem.component(props) }))} />;
};

const BoxEvent = ({ children, ...props }) => {
    return (
        <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
            <Component.CmtDisplayComponents list={children} {...props} />
        </Box>
    );
};

const ActiveFieldEvent = ({ values, setFieldValue }) => {
    return <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Evènement actif ?" />;
};

const ButtonEvent = ({ isSubmitting, initialValues }) => {
    return (
        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
            {initialValues ? 'Modifier' : 'Créer'}
        </Button>
    );
};
