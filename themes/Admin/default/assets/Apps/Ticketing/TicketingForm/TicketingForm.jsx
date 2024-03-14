import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { DEFAULT_CRUD_FORM_COMPONENTS, initYup } from '@Components/CmtCrudForm/CmtCrudForm';
import { Component } from '@/AdminService/Component';
import { constructInitialValues } from '@Services/utils/constructInitialValues';
import { useMemo } from 'react';

export const ticketingInitialSchema = {
    active: (initValues) => initValues?.active || false,
    name: (initValues, { module }) => initValues?.name || module?.name || '',
    type: (initValues) => initValues?.type || '',
    module: (initialValues, { module }) => initialValues?.module?.id || initialValues?.module || module?.id || '',
    catalogSynchronization: (initialValues) => initialValues?.catalogSynchronization || false,
    customerProfile: (initialValues) => initialValues?.customerProfile || false,
    orderTunnel: (initialValues) => initialValues?.orderTunnel || false,
};

export const ticketingValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de la billetterie.').max(250, 'Le nom renseigné est trop long.'),
};

export const ticketingForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Billetterie active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            module: { type: 'string' },
            type: { type: 'string' },
            catalogSynchronization: { type: 'boolean' },
            customerProfile: { type: 'boolean' },
            orderTunnel: { type: 'boolean' },
        },
    },
    ticketingList: {
        default: {
            use: {
                api: false,
                iframe: false,
                external: true,
            },
            formFields: {
                external: [
                    {
                        keyId: 'input-link',
                        style: { xs: 12, sm: 6, md: 4 },
                        input: {
                            name: 'link',
                            label: 'Lien',
                            inputType: 'textField',
                            required: false,
                        },
                    },
                ],
            },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'ticketing',
            label: 'Billetterie',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12 },
                            input: {
                                name: 'name',
                                label: 'Nom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Module',
                    keyId: 'block-module',
                    component: (props) => <Component.TicketingModulePartForm {...props} />,
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};

export const TicketingForm = ({ handleSubmit, initialValues = null, module, formCrud, ...props }) => {
    const getValidations = useMemo(() => {
        let validation = formCrud.form.validationSchema;

        validation = { ...validation, ...formCrud?.ticketingList[module?.name || 'default']?.validations };

        return validation;
    }, []);

    const getInitialSchema = useMemo(() => {
        let schema = formCrud.form.initialSchema;

        schema = { ...schema, data: formCrud?.ticketingList[module?.name || 'default']?.initialSchema };

        return schema;
    }, []);

    const getApiSchema = useMemo(() => {
        let schema = formCrud?.api?.dataFields;

        schema = { ...schema, data: formCrud?.ticketingList[module?.name || 'default']?.api?.data };

        return schema;
    }, []);

    return (
        <Formik
            initialValues={constructInitialValues(getInitialSchema, initialValues, { formCrud, module, ...props })}
            /*  validationSchema={Yup.object().shape(initYup(getValidations, {}))} */
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values, getApiSchema);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, submitForm, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${formCrud?.form?.title} ${module?.name || 'libre'}`}>
                    <Component.CmtDisplayComponents
                        formCrud={formCrud}
                        list={formCrud.components}
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
                        module={module}
                        submitForm={submitForm}
                        {...props}
                    />
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
