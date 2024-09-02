import React, { useRef } from 'react';
import { FieldArray } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardContent, Grid } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

export const eventsPriceFormFields = {
    fields: [
        {
            keyId: 'input-price-name',
            style: {
                xs: 12,
                md: 6,
            },
            input: (props) => {
                return {
                    name: `eventPriceBlocks.${props.blockIndex}.eventPrices.${props.index}.name`,
                    label: 'Nom',
                    inputType: 'textField',
                    required: true,
                    sx: { marginInline: 1 },
                    error: getNestedFormikError(props.touched?.eventPrices, props.errors?.eventPrices, props.index, 'name'),
                    value: props.item.name,
                };
            },
        },
        {
            keyId: 'input-price-number',
            style: {
                xs: 12,
                md: 6,
            },
            input: (props) => {
                return {
                    name: `eventPriceBlocks.${props.blockIndex}.eventPrices.${props.index}.price`,
                    label: 'Prix',
                    inputType: 'textField',
                    type: 'number',
                    required: true,
                    sx: { marginInline: 1 },
                    error: getNestedFormikError(props.touched?.eventPrices, props.errors?.eventPrices, props.index, 'price'),
                    value: props.item.price,
                };
            },
        },
        {
            keyId: 'input-price-annotation',
            style: {
                xs: 12,
            },
            input: (props) => {
                return {
                    name: `eventPriceBlocks.${props.blockIndex}.eventPrices.${props.index}.annotation`,
                    label: 'Annotation',
                    inputType: 'textField',
                    sx: { marginInline: 1 },
                    error: getNestedFormikError(props.touched?.eventPrices, props.errors?.eventPrices, props.index, 'annotation'),
                    value: props.item.annotation,
                };
            },
        },
    ],
};

export const EventsPriceForm = ({ values, touched, errors, handleChange, handleBlur, blockIndex, fields }) => {
    const index = useRef(values?.eventPriceBlocks[blockIndex]?.eventPrices?.length || 0);

    return (
        <FieldArray name={`eventPriceBlocks[${blockIndex}].eventPrices`}>
            {({ remove, push }) => (
                <Box className="padding-2">
                    <Grid container spacing={6}>
                        {values?.eventPriceBlocks[blockIndex]?.eventPrices?.map((item, index) => (
                            <Grid item xs={12} md={6} lg={4} xl={3} key={index}>
                                <Card sx={{ marginBlock: 2, overflow: 'visible' }}>
                                    <CardContent sx={{ position: 'relative' }}>
                                        <Grid container spacing={4}>
                                            <Component.CmtDisplayFields
                                                fields={fields}
                                                values={values}
                                                touched={touched}
                                                errors={errors}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                blockIndex={blockIndex}
                                                item={item}
                                                index={index}
                                            />
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

                    <Box className="flex row-end padding-top-4 padding-left-4">
                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            id="addPriceButton"
                            onClick={() => {
                                push({ name: '', annotation: '', price: '', index: index.current });
                                index.current = index.current + 1;
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
