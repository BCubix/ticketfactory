import React from 'react';
import * as Yup from 'yup';
import { Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentModules from '@Apps/Contents/ContentsForm/ContentModules/index';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';

const TYPE = 'collection';

const FormComponent = ({ values, handleChange, handleBlur, setFieldTouched, setFieldValue, name, errors, field, label, touched, contentModules }) => {
    return (
        <>
            <Component.CmtFormBlock title={label}>
                <FieldArray name={`${name}`}>
                    {({ remove, push }) => (
                        <>
                            {values &&
                                values[field.name]?.map((item, index) => (
                                    <Component.CmtFormBlock title={`${label} N° ${index + 1}`}>
                                        <Box position="relative" key={index}>
                                            <Component.DeleteBlockFabButton
                                                size="small"
                                                onClick={() => {
                                                    remove(index);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Component.DeleteBlockFabButton>

                                            <Component.DisplayContentForm
                                                values={item}
                                                errors={(errors && errors?.at(field.name)?.at(index)?.parameters) || {}}
                                                touched={(touched && touched[field.name]?.at(index)?.parameters) || {}}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                setFieldTouched={setFieldTouched}
                                                setFieldValue={setFieldValue}
                                                contentType={field?.parameters}
                                                contentModules={contentModules}
                                                prefixName={`${name}.${index}.`}
                                            />
                                        </Box>
                                    </Component.CmtFormBlock>
                                ))}

                            <Component.CmtEndPositionWrapper>
                                <Component.AddBlockButton
                                    size="small"
                                    id="addField"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        push(getNewLineInitialValues(field, contentModules));
                                    }}
                                >
                                    <AddIcon /> Ajouter un champ
                                </Component.AddBlockButton>
                            </Component.CmtEndPositionWrapper>
                        </>
                    )}
                </FieldArray>
                {field.helper && (
                    <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                        {field.helper}
                    </Typography>
                )}
            </Component.CmtFormBlock>
        </>
    );
};

const getInitialValue = (field) => {
    const contentModules = ContentModules();

    let fields = {};

    field?.parameters?.fields?.forEach((el) => {
        fields[el.name] = contentModules[el.type]?.getInitialValue(el) || '';
    });

    return [{ ...fields }];
};

const getNewLineInitialValues = (field, contentModules) => {
    let fields = {};

    field?.parameters?.fields?.forEach((el) => {
        fields[el.name] = contentModules[el.type]?.getInitialValue(el) || '';
    });

    return { ...fields };
};

const getSubValidation = (contentType, contentModule) => {
    if (!contentModule?.VALIDATION_TYPE || !contentModule?.VALIDATION_LIST) {
        return {};
    }

    let validation = Yup[contentModule?.VALIDATION_TYPE]();
    const valList = { ...contentType.validations, ...contentType.options };

    contentModule?.VALIDATION_LIST?.forEach((element) => {
        const elVal = valList[element.name];
        if (elVal && element.test(elVal.value)) {
            validation = validation[element.validationName](...element.params({ name: contentType.title, value: elVal.value }));
        }
    });

    return validation;
};

const getValidation = (contentType) => {
    let validation = {};
    const contentModules = ContentModules();

    contentType?.parameters?.fields?.forEach((el) => {
        validation[el.name] = contentModules[el.type]?.getValidation ? contentModules[el.type].getValidation(el) : getSubValidation(el, contentModules[el.type]);
    });

    return Yup.object()
        .shape({ ...validation })
        .nullable();
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    getValidation,
};
