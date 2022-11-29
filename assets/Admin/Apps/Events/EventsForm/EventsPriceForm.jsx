import React from 'react';
import { FieldArray } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardContent, Grid } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

export const EventsPriceForm = ({
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    blockIndex,
}) => {
    return (
        <FieldArray name={`eventPriceBlocks[${blockIndex}].eventPrices`}>
            {({ remove, push }) => (
                <Box sx={{ padding: 2 }}>
                    <Grid container spacing={6}>
                        {values?.eventPriceBlocks[blockIndex]?.eventPrices?.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card sx={{ marginBlock: 2, overflow: 'visible' }}>
                                    <CardContent sx={{ position: 'relative' }}>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12} md={6}>
                                                <Component.CmtTextField
                                                    value={item.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    label="Nom"
                                                    name={`eventPriceBlocks.${blockIndex}.eventPrices.${index}.name`}
                                                    error={getNestedFormikError(
                                                        touched?.eventPrices,
                                                        errors?.eventPrices,
                                                        index,
                                                        'name'
                                                    )}
                                                    sx={{ marginInline: 1 }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Component.CmtTextField
                                                    type="number"
                                                    value={item.price}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    label="Prix"
                                                    name={`eventPriceBlocks.${blockIndex}.eventPrices.${index}.price`}
                                                    error={getNestedFormikError(
                                                        touched?.eventPrices,
                                                        errors?.eventPrices,
                                                        index,
                                                        'price'
                                                    )}
                                                    sx={{ marginInline: 1 }}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Component.CmtTextField
                                                    value={item.annotation}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label="Annotation"
                                                    name={`eventPriceBlocks.${blockIndex}.eventPrices.${index}.annotation`}
                                                    error={getNestedFormikError(
                                                        touched?.eventPrices,
                                                        errors?.eventPrices,
                                                        index,
                                                        'annotation'
                                                    )}
                                                    sx={{ marginInline: 1 }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Component.DeleteBlockFabButton
                                            size="small"
                                            onClick={() => {
                                                remove(index);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </Component.DeleteBlockFabButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box pt={4} pl={4} display="flex" justifyContent={'flex-end'}>
                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            id="addPriceButton"
                            onClick={() => {
                                push({ name: '', annotation: '', price: '' });
                            }}
                        >
                            <AddIcon /> Ajouter
                        </Component.AddBlockButton>
                    </Box>
                </Box>
            )}
        </FieldArray>
    );
};
