import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { FieldArray } from 'formik';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';
import { getPropByString } from '@Services/utils/getPropByString';

const TYPE = 'collection';

const FormComponent = ({ values, handleChange, handleBlur, setFieldTouched, setFieldValue, name, errors, field, label, touched, contentModules, ...props }) => {
    const handleMoveMenuElement = (index, move) => {
        let newList = values[field.name];
        let elem = values[field.name][index];

        newList.splice(index, 1);
        newList.splice(index + move, 0, elem);

        setFieldValue(name, newList);
    };

    return (
        <>
            <Component.CmtFormBlock title={label}>
                <FieldArray name={`${name}`}>
                    {({ remove, push }) => (
                        <>
                            {values &&
                                values[field.name]?.map((item, index) => (
                                    <Component.CmtFormBlock key={index}>
                                        <Box sx={{ position: 'absolute', right: 20, top: 3 }}>
                                            {index < values[field.name]?.length - 1 && (
                                                <Component.MoveElementButton onClick={() => handleMoveMenuElement(index, 1)} title="Descendre d'un cran">
                                                    <ArrowDownwardIcon fontSize="inherit" />
                                                </Component.MoveElementButton>
                                            )}

                                            {index > 0 && (
                                                <Component.MoveElementButton onClick={() => handleMoveMenuElement(index, -1)} title="Monter d'un cran">
                                                    <ArrowUpwardIcon fontSize="inherit" />
                                                </Component.MoveElementButton>
                                            )}
                                        </Box>

                                        <Box key={index}>
                                            <Component.DeleteBlockFabButton
                                                size="small"
                                                onClick={() => {
                                                    remove(index);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Component.DeleteBlockFabButton>

                                            <Component.DisplayContentForm
                                                {...props}
                                                values={item}
                                                errors={(errors && getPropByString(errors, `${field.name}.${index}.parameters`)) || {}}
                                                touched={(touched && touched[field.name]?.at(index)?.parameters) || {}}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                setFieldTouched={setFieldTouched}
                                                setFieldValue={setFieldValue}
                                                contentType={field?.parameters}
                                                contentModules={contentModules}
                                                prefixName={`${name}.${index}.`}
                                                displayGroupLabel={false}
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

const getInitialValue = (field, contentModules) => {
    let fields = {};

    field?.parameters?.fields?.forEach((el) => {
        fields[el.name] = contentModules[el.type]?.getInitialValue(el, contentModules) || '';
    });

    return [{ ...fields }];
};

const getNewLineInitialValues = (field, contentModules) => {
    let fields = {};

    field?.parameters?.fields?.forEach((el) => {
        fields[el.name] = contentModules[el.type]?.getInitialValue(el, contentModules) || '';
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

const getValidation = (contentType, contentModules) => {
    let validation = {};

    contentType?.parameters?.fields?.forEach((el) => {
        validation[el.name] = contentModules[el.type]?.getValidation ? contentModules[el.type].getValidation(el, contentModules) : getSubValidation(el, contentModules[el.type]);
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
