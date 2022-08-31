import React from 'react';
import { CmtTabs } from '../../../../Components/CmtTabs/CmtTabs';
import { MainPartFieldForm } from './FieldArrayPartForm/MainPartFieldForm';
import { OptionsPartFieldForm } from './FieldArrayPartForm/OptionsPartFieldForm';
import { ValidationPartFieldForm } from './FieldArrayPartForm/ValidationPartFieldForm';

export const FieldArrayElem = ({
    values,
    index,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    prefixName,
}) => {
    return (
        <CmtTabs
            list={[
                {
                    label: 'Informations générales',
                    component: (
                        <MainPartFieldForm
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            index={index}
                            prefixName={prefixName}
                        />
                    ),
                },
                {
                    label: 'Options',
                    component: (
                        <OptionsPartFieldForm
                            values={values}
                            fieldIndex={index}
                            errors={errors && errors[index]}
                            touched={touched && touched[index]}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            prefixName={prefixName}
                        />
                    ),
                },
                {
                    label: 'Validation',
                    component: (
                        <ValidationPartFieldForm
                            values={values}
                            fieldIndex={index}
                            errors={errors && errors[index]}
                            touched={touched && touched[index]}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            prefixName={prefixName}
                        />
                    ),
                    hidden: Object.keys(values?.validations)?.length === 0,
                },
            ]}
            tabValue={0}
        />
    );
};
