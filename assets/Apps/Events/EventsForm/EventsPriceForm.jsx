import React from 'react';
import { FieldArray } from 'formik';
import { Box } from '@mui/system';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Card, CardContent, Fab, TextField, Typography } from '@mui/material';

export const EventsPriceForm = ({
    values,
    setFieldValue,
    setFieldTouched,
    touched,
    errors,
    handleChange,
    handleBlur,
}) => {
    return (
        <FieldArray name="eventPrices">
            {({ remove, push }) => (
                <Box>
                    {values?.eventPrices?.map((item, index) => (
                        <Card sx={{ marginBlock: 2 }} key={index}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    margin="normal"
                                    size="small"
                                    value={item.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    fullWidth
                                    id={`eventPrices.${index}.name`}
                                    label="Nom"
                                    name={`eventPrices.${index}.name`}
                                    autoComplete="name"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={
                                        touched.eventPrices &&
                                        touched.eventPrices[index].name &&
                                        errors.eventPrices &&
                                        errors.eventPrices[index].name
                                    }
                                    sx={{ marginInline: 1 }}
                                />

                                <TextField
                                    margin="normal"
                                    size="small"
                                    value={item.annotation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    fullWidth
                                    id={`eventPrices.${index}.annotation`}
                                    label="Annotation"
                                    name={`eventPrices.${index}.annotation`}
                                    autoComplete="name"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={
                                        touched.eventPrices &&
                                        touched.eventPrices[index].annotation &&
                                        errors.eventPrices &&
                                        errors.eventPrices[index].annotation
                                    }
                                    sx={{ marginInline: 1 }}
                                />

                                <TextField
                                    margin="normal"
                                    size="small"
                                    type="number"
                                    value={item.price}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    fullWidth
                                    id={`eventPrices.${index}.price`}
                                    label="price"
                                    name={`eventPrices.${index}.price`}
                                    autoComplete="name"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={
                                        touched.eventPrices &&
                                        touched.eventPrices[index].price &&
                                        errors.eventPrices &&
                                        errors.eventPrices[index].price
                                    }
                                    sx={{ marginInline: 1 }}
                                />
                                <Fab
                                    sx={{ marginLeft: 2, flexShrink: 0 }}
                                    pt="2px"
                                    className="pointer"
                                    size="small"
                                    onClick={() => {
                                        remove(index);
                                    }}
                                >
                                    <DeleteIcon color="error" />
                                </Fab>
                            </CardContent>
                        </Card>
                    ))}
                    <Box pt={2} pl={4}>
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => {
                                push({ name: '', annotation: '', price: 0 });
                            }}
                        >
                            <PostAddIcon />
                            <Typography mt={1} component="p" variant="body1">
                                Ajouter un tarif
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            )}
        </FieldArray>
    );
};
