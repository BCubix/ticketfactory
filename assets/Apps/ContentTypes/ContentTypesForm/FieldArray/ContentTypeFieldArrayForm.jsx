import { Card, CardContent, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import React from 'react';
import { FieldArrayElem } from './FieldArrayElem';
import { CmtEndPositionWrapper } from '@Components/CmtEndButtonWrapper/sc.CmtEndPositionWrapper';
import { AddBlockButton, DeleteBlockFabButton } from '@Components/CmtButton/sc.Buttons';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
                    <Box sx={{ width: '100%', marginTop: 2, paddingInline: 1 }}>
                        {values?.fields?.map((item, index) => (
                            <Card
                                key={index}
                                sx={{ position: 'relative', overflow: 'visible', marginBottom: 7 }}
                            >
                                <CardContent>
                                    <Box p={2}>
                                        <DeleteBlockFabButton
                                            size="small"
                                            onClick={() => {
                                                remove(index);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </DeleteBlockFabButton>

                                        <InputLabel sx={{ marginBottom: 3 }} id={index}>
                                            Champ n°{index + 1}
                                        </InputLabel>

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
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}

                        <CmtEndPositionWrapper>
                            <AddBlockButton
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    const type = 'text';
                                    const initialValues =
                                        contentTypesModules['TextFieldType'].getInitialValues();

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
                            </AddBlockButton>
                        </CmtEndPositionWrapper>
                    </Box>
                )}
            </FieldArray>
        </>
    );
};
