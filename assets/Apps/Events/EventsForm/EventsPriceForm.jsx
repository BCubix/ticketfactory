import React from 'react';
import { FieldArray } from 'formik';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { CmtRemoveButton } from '../../../Components/CmtRemoveButton/CmtRemoveButton';
import CloseIcon from '@mui/icons-material/Close';
import { getNestedFormikError } from '../../../services/utils/getNestedFormikError';

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
                <Box>
                    <Grid container spacing={4}>
                        {values?.eventPriceBlocks[blockIndex]?.eventPrices?.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card sx={{ marginBlock: 2, overflow: 'visible' }}>
                                    <CardContent sx={{ position: 'relative' }}>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12} md={6}>
                                                <CmtTextField
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
                                                <CmtTextField
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
                                                <CmtTextField
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

                                        <CmtRemoveButton
                                            pt="2px"
                                            className="pointer"
                                            size="small"
                                            onClick={() => {
                                                remove(index);
                                            }}
                                        >
                                            <CloseIcon />
                                        </CmtRemoveButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box pt={2} pl={4} display="flex" justifyContent={'flex-end'}>
                        <Button
                            size="small"
                            color="primary"
                            variant="contained"
                            onClick={() => {
                                push({ name: '', annotation: '', price: 0 });
                            }}
                        >
                            <AddIcon />
                            <Typography mt={'2px'} component="p" variant="body1">
                                Ajouter
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            )}
        </FieldArray>
    );
};
