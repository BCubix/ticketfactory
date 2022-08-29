import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import React from 'react';
import { FieldArrayElem } from './FieldArrayElem';
import { FIELDS_TYPE } from '../fieldsType/fieldsType';
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
}) => {
    return (
        <>
            <FieldArray name="fields">
                {({ remove, push }) => (
                    <Box>
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

                                    const fieldTypeObject = FIELDS_TYPE?.find(
                                        (el) => el.name === fieldType
                                    );

                                    fieldTypeObject?.options?.forEach((el) => {
                                        options[el.name] = el.type === 'boolean' ? false : '';
                                    });

                                    fieldTypeObject?.validations?.forEach((el) => {
                                        validations[el.name] = el.type === 'boolean' ? false : '';
                                    });

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
