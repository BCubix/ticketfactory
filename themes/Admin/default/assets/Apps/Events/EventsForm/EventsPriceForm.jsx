import React, { useRef } from 'react';

import { FieldArray } from 'formik';
import { Component } from '@/AdminService/Component';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';
import { Box, Card, CardContent, Grid, Radio, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
                    name: `eventPriceCategories.${props.blockIndex}.eventPrices.${props.index}.name`,
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
                    name: `eventPriceCategories.${props.blockIndex}.eventPrices.${props.index}.price`,
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
                    name: `eventPriceCategories.${props.blockIndex}.eventPrices.${props.index}.annotation`,
                    label: 'Annotation',
                    inputType: 'textField',
                    sx: { marginInline: 1 },
                    error: getNestedFormikError(props.touched?.eventPrices, props.errors?.eventPrices, props.index, 'annotation'),
                    value: props.item.annotation,
                };
            },
        },
        {
            keyId: 'input-price-default',
            style: {
                xs: 12,
            },
            component: ({ values, setFieldValue, ...props }) => {
                const eventPrices = values?.eventPriceCategories?.[props.blockIndex]?.eventPrices || [];
                const isDefaultPrice = eventPrices[props.index]?.defaultPrice;

                return (
                    <div>
                        <Typography>
                            {' '}
                            Tarif par défaut :
                            <Radio
                                checked={isDefaultPrice}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    const updatedEventPrices = eventPrices.map((price, index) => ({
                                        ...price,
                                        defaultPrice: index === props.index,
                                    }));

                                    setFieldValue(`eventPriceCategories.${props.blockIndex}.eventPrices`, updatedEventPrices);
                                }}
                                id={`eventPriceCategories.${props.blockIndex}.eventPrices.${props.index}.defaultPrice`}
                            />
                        </Typography>
                    </div>
                );
            },
        },
    ],
};
export const EventsPriceForm = ({ dataPath = 'eventPriceCategories', values, touched, errors, handleChange, handleBlur, blockIndex, fields, ...props }) => {
    // Helper function to access dynamic paths in values
    const getNestedValue = (path, object) => {
        return path.split('.').reduce((acc, part) => acc?.[part], object);
    };
    const handleString = (inputString) => {
        if (inputString.endsWith('eventPriceCategories')) {
            let res = inputString.slice(0, inputString.lastIndexOf('eventPriceCategories')).replace(/\.$/, '');
            if (res !== '' && res[res.length - 1] !== '.')
                // Correct way to check the last character
                res += '.';
            return res;
        }
        return inputString;
    };

    const eventPriceCategories = getNestedValue(dataPath, values) || [];
    const eventPrices = eventPriceCategories[blockIndex]?.eventPrices || [];

    const index = useRef(eventPrices.length || 0);

    return (
        <FieldArray name={`${dataPath}[${blockIndex}].eventPrices`}>
            {({ remove, push }) => (
                <Box className="padding-2">
                    <Grid container spacing={6}>
                        {/* Loop over eventPrices */}
                        {eventPrices.map((item, index) => {
                            return (
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
                                                    baseName={handleString(dataPath)}
                                                    {...props}
                                                />
                                            </Grid>

                                            <Component.DeleteBlockFabButton
                                                size="small"
                                                onClick={() => {
                                                    remove(index); // Remove the eventPrice from the array
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Component.DeleteBlockFabButton>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                    <Box className="flex row-end padding-top-4 padding-left-4">
                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            id="addPriceButton"
                            onClick={() => {
                                push({
                                    name: '',
                                    annotation: '',
                                    price: '',
                                    defaultPrice: index.current === 0,
                                    index: index.current,
                                });
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
