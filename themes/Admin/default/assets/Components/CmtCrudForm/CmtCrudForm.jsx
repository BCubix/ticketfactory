import React, { useState } from 'react';
import * as Yup from 'yup';
import { Component } from '@/AdminService/Component';
import { Formik } from 'formik';
import { constructInitialValues } from '@Services/utils/constructInitialValues';

export const DEFAULT_CRUD_FORM_COMPONENTS = {
    wrapperComponent: (props) => <Component.CmtCrudForm {...props} />,
    components: [
        {
            component: ({ formCrud, ...props }) => <DisplayFormTabs tabs={formCrud?.fields} formCrud={formCrud} {...props} />,
        },
        {
            component: (props) => <Component.CmtActiveBlock {...props} />,
        },
    ],
};

export const DisplayFormTabs = ({ tabs, tabValue, setTabValue, ...props }) => {
    return (
        <Component.CmtTabs
            containerStyle={{ mt: 3 }}
            tabValue={tabValue}
            setTabValue={setTabValue}
            mountComponents
            list={tabs.map((elem) => ({
                id: elem.keyId,
                label: elem.label,
                component: elem?.component ? elem.component({ fields: elem?.fields, ...props }) : Component.CmtDisplayBlocks({ blocks: elem?.fields, ...props }),
            }))}
        />
    );
};

export const initYup = (list, props) => {
    let result = {};

    Object.entries(list)?.map(([key, value]) => {
        if (typeof value === 'function') {
            result[key] = value(props);
        } else {
            result[key] = value;
        }
    });

    return result;
};

export const CmtCrudForm = ({ formCrud, initialValues, translateInitialValues, handleSubmit, ...props }) => {
    const initValues = translateInitialValues || initialValues;
    const validationSchema = Yup.object().shape(initYup(formCrud.form.validationSchema, { formCrud, initialValues, translateInitialValues, handleSubmit, ...props }));
    const [tabValue, setTabValue] = useState(0);

    const checkFormErrors = () => {
        const result = document.getElementsByClassName('js-tab-content');
        for (let i = 0; result?.length > i; i++) {
            if (result[i].getElementsByClassName('Mui-error')?.length > 0) {
                setTabValue(i);
                return;
            }
        }
    };

    return (
        <Formik
            initialValues={constructInitialValues(formCrud.form.initialSchema, initValues, { ...props })}
            validationSchema={validationSchema}
            translateInitialValues={translateInitialValues}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
            {...(formCrud?.form?.formProps || {})}
        >
            {({ values, errors, touched, handleChange, setFieldTouched, setFieldValue, handleBlur, handleSubmit, isSubmitting, validateForm, submitForm }) => (
                <Component.CmtPageWrapper component="form" noValidate onSubmit={handleSubmit} title={formCrud?.form?.title}>
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
                        validationSchema={validationSchema}
                        checkFormErrors={checkFormErrors}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                        validateForm={validateForm}
                        submitForm={submitForm}
                        {...props}
                    />
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
