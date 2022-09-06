import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import React from 'react';
import { FieldArrayElem } from './FieldArrayElem';
import { FieldElemWrapper } from '../sc.ContentTypeFields';
import { CmtEndPositionWrapper } from '../../../../Components/CmtEndButtonWrapper/sc.CmtEndPositionWrapper';
import { useSelector } from 'react-redux';
import { contentTypeFieldsSelector } from '../../../../redux/contentTypeFields/contentTypeFieldsSlice';

export const ContentTypeFieldArrayForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    prefixName = '',
}) => {
    const { contentTypeFields } = useSelector(contentTypeFieldsSelector);

    return (
        <>
            <FieldArray name={`${prefixName}fields`}>
                {({ remove, push }) => (
                    <Box sx={{ width: '100%' }}>
                        {values?.fields?.map((item, index) => (
                            <FieldElemWrapper key={index}>
                                <Typography component="p" variant="h4">
                                    Champ n°{index + 1}
                                </Typography>

                                <FieldArrayElem
                                    values={item}
                                    index={index}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    prefixName={prefixName}
                                />

                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        remove(index);
                                    }}
                                    sx={{ marginTop: 5, marginBottom: 3 }}
                                >
                                    Supprimer
                                </Button>
                            </FieldElemWrapper>
                        ))}

                        <CmtEndPositionWrapper>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    const fieldType = 'text';
                                    let options = {};
                                    let validations = {};

                                    const key = Object.keys(contentTypeFields).find(
                                        (k) => k === fieldType
                                    );

                                    const fieldTypeObject = contentTypeFields[key];

                                    Object.entries(fieldTypeObject?.options)?.forEach(
                                        ([key, value]) => {
                                            options[key] = value.type === 'boolean' ? false : '';
                                        }
                                    );

                                    Object.entries(fieldTypeObject?.validations)?.forEach(
                                        ([key, value]) => {
                                            validations[key] =
                                                value.type === 'boolean' ? false : '';
                                        }
                                    );

                                    push({
                                        title: '',
                                        name: '',
                                        fieldType: fieldType,
                                        instructions: '',
                                        options: options || {},
                                        validations: validations || {},
                                    });
                                }}
                            >
                                Ajouter un champ
                            </Button>
                        </CmtEndPositionWrapper>
                    </Box>
                )}
            </FieldArray>
        </>
    );
};
