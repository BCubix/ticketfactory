import { Box, Button, Card, CardContent, Fab, TextField, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import React from 'react';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import DeleteIcon from '@mui/icons-material/Delete';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import AddIcon from '@mui/icons-material/Add';

export const RoomsSeatingPlanPartForm = ({ values, errors, touched, handleChange, handleBlur }) => {
    return (
        <CmtFormBlock title="Plans">
            <FieldArray name="seatingPlans">
                {({ remove, push }) => (
                    <Box>
                        {values.seatingPlans?.map((item, index) => (
                            <Card sx={{ marginBlock: 2 }} key={index}>
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
                                    />
                                    <Fab
                                        sx={{ marginLeft: 2, marginTop: 2, flexShrink: 0 }}
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
        </CmtFormBlock>
    );
};
