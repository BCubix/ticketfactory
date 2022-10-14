import { Typography } from '@mui/material';
import React from 'react';
import ContentModules from '.';
import { CmtFormBlock } from '../../../../Components/CmtFormBlock/CmtFormBlock';
import { CONTENT_MODULES_EXTENSION } from '../../../../Constant';
import { DisplayContentForm } from '../DisplayContentForm';
import * as Yup from 'yup';

const FormComponent = ({
    values,
    handleChange,
    handleBlur,
    setFieldTouched,
    setFieldValue,
    name,
    errors,
    field,
    label,
    touched,
    contentModules,
}) => {
    return (
        <>
            <CmtFormBlock title={label}>
                <DisplayContentForm
                    values={values[field.name]}
                    errors={(errors && errors[field.name]?.parameters) || {}}
                    touched={(touched && touched[field.name]?.parameters) || {}}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldTouched={setFieldTouched}
                    setFieldValue={setFieldValue}
                    contentType={field?.parameters}
                    contentModules={contentModules}
                    prefixName={`${name}.`}
                />

                {field.helper && (
                    <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                        {field.helper}
                    </Typography>
                )}
            </CmtFormBlock>
        </>
    );
};

const getInitialValue = (field) => {
    const contentModules = ContentModules();

    let fields = {};

    field?.parameters?.fields?.forEach((el) => {
        const moduleName =
            String(el.type).charAt(0).toUpperCase() + el.type?.slice(1) + CONTENT_MODULES_EXTENSION;

        fields[el.name] = contentModules[moduleName]?.getInitialValue(el) || '';
    });

    return { fields: fields };
};

const getSubValidation = (contentType, contentModule) => {
    if (!contentModule?.VALIDATION_TYPE || !contentModule?.VALIDATION_LIST) {
        return;
    }

    let validation = Yup[contentModule?.VALIDATION_TYPE]();

    const valList = [...contentType.validations, ...contentType.options];

    contentModule?.VALIDATION_LIST?.forEach((element) => {
        const elVal = valList.find((el) => el.name === element.name);
        if (elVal && element.test(elVal.value)) {
            validation = validation[element.validationName](
                ...element.params({ name: contentType.title, value: elVal.value })
            );
        }
    });

    return validation;
};

const getValidation = (contentType) => {
    let validation = {};
    const contentModules = ContentModules();

    contentType?.parameters?.fields?.forEach((el) => {
        const moduleName =
            String(el.type).charAt(0).toUpperCase() + el.type?.slice(1) + CONTENT_MODULES_EXTENSION;

        validation[el.name] = contentModules[moduleName]?.getValidation
            ? contentModules[moduleName].getValidation(el)
            : getSubValidation(el, contentModules[moduleName]);
    });

    return Yup.array().of(Yup.object().shape({ ...validation }));
};

export default {
    FormComponent,
    getInitialValue,
    getValidation,
};
