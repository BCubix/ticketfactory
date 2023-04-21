import React from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import { FieldArray } from 'formik';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { Component } from '@/AdminService/Component';

const TYPE = 'array<Price>';

function getType() {
    return TYPE;
}

const getComponent = ({ paramName, paramValue, paramBreakpoints, handleChange, indexTab, indexBlock, indexParam }) => {
    return (
        <Grid item key={indexParam} {...paramBreakpoints}>
            <Component.CmtFormBlock title={paramName}>
                <FieldArray name={`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`}>
                    {({ remove, push }) => (
                        <Box sx={{ padding: 2 }}>
                            <Grid container spacing={6}>
                                {paramValue?.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                        <Card sx={{ marginBlock: 2, overflow: 'visible' }}>
                                            <CardContent sx={{ position: 'relative' }}>
                                                <Grid container spacing={4}>
                                                    <Grid item xs={12} md={6}>
                                                        <Component.CmtTextField
                                                            value={item.name}
                                                            onChange={handleChange}
                                                            label="Nom"
                                                            name={`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue.${index}.name`}
                                                            sx={{ marginInline: 1 }}
                                                            required
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} md={6}>
                                                        <Component.CmtTextField
                                                            type="number"
                                                            value={item.price}
                                                            onChange={handleChange}
                                                            required
                                                            label="Prix"
                                                            name={`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue.${index}.price`}
                                                            sx={{ marginInline: 1 }}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Component.CmtTextField
                                                            value={item.annotation}
                                                            onChange={handleChange}
                                                            label="Annotation"
                                                            name={`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue.${index}.annotation`}
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
            </Component.CmtFormBlock>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
