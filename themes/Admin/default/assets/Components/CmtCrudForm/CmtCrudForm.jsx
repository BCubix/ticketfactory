import React from 'react';
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

const DisplayFormTabs = ({ tabs, ...props }) => {
    return (
        <Component.CmtTabs
            containerStyle={{ mt: 3 }}
            list={tabs.map((elem) => ({
                id: elem.keyId,
                label: elem.label,
                component: elem?.component ? elem.component(props) : Component.CmtDisplayBlocks({ blocks: elem?.fields, ...props }),
            }))}
        />
    );
};

export const CmtCrudForm = ({ formCrud, initialValues, translateInitialValues, handleSubmit, ...props }) => {
    const initValues = translateInitialValues || initialValues;

    return (
        <Formik
            initialValues={constructInitialValues(formCrud.form.initialSchema, initValues, { props })}
            validationSchema={Yup.object().shape(formCrud.form.validationSchema)}
            translateInitialValues={translateInitialValues}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, setFieldTouched, setFieldValue, handleBlur, handleSubmit, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={formCrud?.form?.title}>
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
                        {...props}
                    />
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
