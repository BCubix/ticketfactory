import React from 'react';
import { FieldArray } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, CardContent, FormHelperText, InputLabel } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

export const PagesBlocksForm = ({ values, errors, touched, setFieldValue, setFieldTouched }) => {
    return (
        <FieldArray name="pageBlocks">
            {({ remove, push }) => (
                <Box sx={{ width: '100%', marginTop: 2, paddingInline: 1 }}>
                    {values.pageBlocks?.map(({ content }, index) => (
                        <Card
                            key={index}
                            sx={{ position: 'relative', overflow: 'visible', marginBottom: 7 }}
                        >
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
                                        Bloc n°{index + 1}
                                    </InputLabel>

                                    <Component.LightEditorFormControl
                                        id={`pageBlocks-${index}-contentControl`}
                                    >
                                        <Component.LightEditor
                                            labelId={index}
                                            value={content}
                                            onBlur={() =>
                                                setFieldTouched(
                                                    `pageBlocks.${index}.content`,
                                                    true,
                                                    false
                                                )
                                            }
                                            id={`pageBlocks-${index}-content`}
                                            onChange={(val) => {
                                                setFieldValue(`pageBlocks.${index}.content`, val);
                                            }}
                                            error={getNestedFormikError(
                                                touched?.pageBlocks,
                                                errors?.pageBlocks,
                                                index,
                                                'content'
                                            )}
                                        />
                                    </Component.LightEditorFormControl>

                                    {getNestedFormikError(
                                        touched?.pageBlocks,
                                        errors?.pageBlocks,
                                        index,
                                        'content'
                                    ) && (
                                        <FormHelperText
                                            error
                                            id={`pageBlocks-${index}-content-helper-text`}
                                        >
                                            {getNestedFormikError(
                                                touched?.pageBlocks,
                                                errors?.pageBlocks,
                                                index,
                                                'content'
                                            )}
                                        </FormHelperText>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    <Component.CmtEndPositionWrapper>
                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            id="addContentButton"
                            onClick={() => {
                                push({ content: '' });
                            }}
                        >
                            <AddIcon /> Ajouter un contenu
                        </Component.AddBlockButton>
                    </Component.CmtEndPositionWrapper>
                </Box>
            )}
        </FieldArray>
    );
};
