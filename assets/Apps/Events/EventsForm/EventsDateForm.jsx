import { Button, Card, CardContent, Fab, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import moment from 'moment';
import { CmtDateTimePicker } from '../../../Components/CmtDateTimePicker/CmtDateTimePicker';

export const EventsDateForm = ({ values, setFieldValue, setFieldTouched, touched, errors }) => {
    return (
        <FieldArray name="eventDates">
            {({ remove, push }) => (
                <Box>
                    {values?.eventDates?.map((item, index) => (
                        <Card sx={{ marginBlock: 2 }} key={index}>
                            <CardContent sx={{ display: 'flex' }}>
                                <CmtDateTimePicker
                                    fullWidth
                                    value={item.eventDate}
                                    disablePast
                                    setValue={(value) => {
                                        setFieldValue(
                                            `eventDates.${index}.eventDate`,
                                            moment(value).format('YYYY-MM-DD HH:mm')
                                        );
                                    }}
                                    onTouched={setFieldTouched}
                                    name="fromDate"
                                    error={
                                        touched.eventDates &&
                                        touched.eventDates[index].eventDate &&
                                        errors.eventDate &&
                                        errors.eventDates[index].eventDate
                                    }
                                />
                                <Fab
                                    sx={{ marginLeft: 2 }}
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
                                push({ eventDate: '' });
                            }}
                        >
                            <PostAddIcon />
                            <Typography mt={1} component="p" variant="body1">
                                Ajouter une date
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            )}
        </FieldArray>
    );
};
