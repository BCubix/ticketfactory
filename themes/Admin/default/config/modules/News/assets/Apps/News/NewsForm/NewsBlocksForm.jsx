import React from 'react';
import { FieldArray } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, CardContent, FormHelperText, InputLabel } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";
import { getNestedFormikError } from '@/services/utils/getNestedFormikError';

export const NewsBlocksForm = ({
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
}) => {
    return (
        <FieldArray name="newsBlocks">
            {({ remove, push }) => (
                <Box sx={{ width: '100%', marginTop: 2, paddingInline: 1 }}>
                    {values.newsBlocks?.map(({ title, content }, index) => (
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

                                    <Component.CmtTextField
                                        value={title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Titre du bloc"
                                        name={`newsBlocks.${index}.title`}
                                        error={getNestedFormikError(
                                            touched?.newsBlocks,
                                            errors?.newsBlocks,
                                            index,
                                            'title'
                                        )}
                                        required
                                    />

                                    <Component.LightEditorFormControl>
                                        <Component.LightEditor
                                            labelId={index}
                                            value={content}
                                            onBlur={() =>
                                                setFieldTouched(
                                                    `newsBlocks.${index}.content`,
                                                    true,
                                                    false
                                                )
                                            }
                                            onChange={(val) => {
                                                setFieldValue(`newsBlocks.${index}.content`, val);
                                            }}
                                            error={getNestedFormikError(
                                                touched?.newsBlocks,
                                                errors?.newsBlocks,
                                                index,
                                                'content'
                                            )}
                                        />
                                    </Component.LightEditorFormControl>

                                    <FormHelperText error>
                                        {getNestedFormikError(
                                            touched?.newsBlocks,
                                            errors?.newsBlocks,
                                            index,
                                            'content'
                                        )}
                                    </FormHelperText>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    <Component.CmtEndPositionWrapper>
                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
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
