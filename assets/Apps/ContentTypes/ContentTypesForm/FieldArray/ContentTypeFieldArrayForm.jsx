import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import React from 'react';
import { FieldArrayElem } from './FieldArrayElem';
import { FieldElemWrapper } from '../sc.ContentTypeFields';
import { CmtEndPositionWrapper } from '../../../../Components/CmtEndButtonWrapper/sc.CmtEndPositionWrapper';

export const ContentTypeFieldArrayForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    prefixName = '',
    contentTypesModules,
}) => {
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
                                    contentTypesModules={contentTypesModules}
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
                                    const initialValues =
                                        contentTypesModules['TextFieldType'].getInitialValues();

                                    push({
                                        title: '',
                                        name: '',
                                        fieldType: fieldType,
                                        instructions: '',
                                        options: initialValues.options,
                                        validations: initialValues.validations || {},
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
