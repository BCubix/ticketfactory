import { Box, Button, Card, CardContent, Fab, TextField, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import React from 'react';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { AddBlockButton, DeleteBlockFabButton } from '../../../Components/CmtButton/sc.Buttons';

export const RoomsSeatingPlanPartForm = ({ values, errors, touched, handleChange, handleBlur }) => {
    return (
        <CmtFormBlock title="Plans">
            <FieldArray name="seatingPlans">
                {({ remove, push }) => (
                    <Box sx={{ padding: 2 }}>
                        {values.seatingPlans?.map((item, index) => (
                            <Card
                                sx={{ marginBlock: 7, position: 'relative', overflow: 'visible' }}
                                key={index}
                            >
                                <CardContent sx={{ display: 'flex' }}>
                                    <CmtTextField
                                        value={item.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Nom"
                                        name={`seatingPlans.${index}.name`}
                                        error={
                                            touched.seatingPlans &&
                                            touched.seatingPlans[index]?.name &&
                                            errors.seatingPlans &&
                                            errors.seatingPlans[index]?.name
                                        }
                                        sx={{ marginInline: 1 }}
                                        required
                                    />
                                    <DeleteBlockFabButton
                                        size="small"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </DeleteBlockFabButton>
                                </CardContent>
                            </Card>
                        ))}
                        <Box pt={2} pl={4} display="flex" justifyContent={'flex-end'}>
                            <AddBlockButton
                                size="small"
                                color="primary"
                                variant="outlined"
                                onClick={() => {
                                    push({ name: '' });
                                }}
                            >
                                <AddIcon />
                                <Typography mt={'2px'} component="p" variant="body1">
                                    Ajouter
                                </Typography>
                            </AddBlockButton>
                        </Box>
                    </Box>
                )}
            </FieldArray>
        </CmtFormBlock>
    );
};
