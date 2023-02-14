import React from 'react';
import { FieldArray } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, CardContent, InputLabel } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const ContentTypeFieldArrayForm = ({ values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, prefixName = '', contentTypesModules }) => {
    return (
        <>
            <FieldArray name={`${prefixName}fields`}>
                {({ remove, push }) => (
                    <Box sx={{ width: '100%', marginTop: 2, paddingInline: 1 }}>
                        {values?.fields?.map((item, index) => (
                            <Card key={index} sx={{ position: 'relative', overflow: 'visible', marginBottom: 7 }} className="contentTypeArrayElement">
                                <CardContent>
                                    <Box p={2}>
                                        <Component.DeleteBlockFabButton
                                            size="small"
                                            onClick={() => {
                                                remove(index);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </Component.DeleteBlockFabButton>

                                        <InputLabel sx={{ marginBottom: 3 }} id={index}>
                                            Champ n°{index + 1}
                                        </InputLabel>

                                        <Component.FieldArrayElem
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
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}

                        <Component.CmtEndPositionWrapper>
                            <Component.AddBlockButton
                                size="small"
                                id="addField"
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    const type = 'text';
                                    const initialValues = contentTypesModules[type].getInitialValues();

                                    push({
                                        title: '',
                                        name: '',
                                        type: type,
                                        helper: '',
                                        options: initialValues.options,
                                        validations: initialValues.validations || {},
                                    });
                                }}
                            >
                                <AddIcon /> Ajouter un champ
                            </Component.AddBlockButton>
                        </Component.CmtEndPositionWrapper>
                    </Box>
                )}
            </FieldArray>
        </>
    );
};
