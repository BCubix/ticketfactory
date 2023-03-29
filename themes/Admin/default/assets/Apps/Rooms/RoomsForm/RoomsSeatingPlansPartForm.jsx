import React from 'react';
import { FieldArray } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardContent, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';

export const RoomsSeatingPlanPartForm = ({ values, errors, touched, handleChange, handleBlur, initialValues }) => {
    return (
        <Component.CmtFormBlock title="Plans">
            <FieldArray name="seatingPlans">
                {({ remove, push }) => (
                    <Box sx={{ padding: 2 }}>
                        {values.seatingPlans?.map((item, index) => (
                            <Card sx={{ marginBlock: 7, position: 'relative', overflow: 'visible' }} key={index}>
                                <CardContent sx={{ display: 'flex' }}>
                                    <Component.CmtTextField
                                        value={item.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Nom"
                                        name={`seatingPlans.${index}.name`}
                                        id={`seatingPlans-${index}-name`}
                                        error={touched.seatingPlans && touched.seatingPlans[index]?.name && errors.seatingPlans && errors.seatingPlans[index]?.name}
                                        sx={{ marginInline: 1 }}
                                        required
                                    />
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
                        ))}
                        <Box pt={2} pl={4} display="flex" justifyContent={'flex-end'}>
                            <Component.AddBlockButton
                                size="small"
                                color="primary"
                                variant="outlined"
                                id="addSeatingPlanButton"
                                onClick={() => {
                                    push({ name: '', lang: initialValues?.lang?.id || '', languageGroup: '' });
                                }}
                            >
                                <AddIcon /> Ajouter
                            </Component.AddBlockButton>
                        </Box>
                    </Box>
                )}
            </FieldArray>
        </Component.CmtFormBlock>
    );
};
