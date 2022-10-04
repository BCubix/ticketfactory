import {
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    ListItemText,
    Box,
    MenuItem,
    Select,
} from '@mui/material';
import { FieldArray } from 'formik';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import moment from 'moment';
import { CmtDateTimePicker } from '../../../Components/CmtDateTimePicker/CmtDateTimePicker';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { getNestedFormikError } from '../../../services/utils/getNestedFormikError';
import { AddBlockButton, DeleteBlockFabButton } from '../../../Components/CmtButton/sc.Buttons';
import DeleteIcon from '@mui/icons-material/Delete';

const STATES = [
    { label: 'Valide', value: 'valid' },
    { label: 'Reporté', value: 'delayed' },
    { label: 'Annulé', value: 'canceled' },
    { label: 'Nouvelle date', value: 'new_date' },
];

export const EventsDateForm = ({
    values,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    touched,
    errors,
    blockIndex,
}) => {
    return (
        <FieldArray name={`eventDateBlocks[${blockIndex}].eventDates`}>
            {({ remove, push }) => (
                <Box sx={{ padding: 2 }}>
                    <Grid container spacing={6}>
                        {values?.eventDateBlocks[blockIndex]?.eventDates?.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card sx={{ marginBlock: 2, overflow: 'visible' }}>
                                    <CardContent sx={{ position: 'relative' }}>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12}>
                                                <CmtDateTimePicker
                                                    fullWidth
                                                    value={item.eventDate}
                                                    disablePast
                                                    label="Date"
                                                    required
                                                    setValue={(value) => {
                                                        setFieldValue(
                                                            `eventDateBlocks.${blockIndex}.eventDates.${index}.eventDate`,
                                                            moment(value).format('YYYY-MM-DD HH:mm')
                                                        );
                                                    }}
                                                    onTouched={setFieldTouched}
                                                    name={`eventDateBlocks.${blockIndex}.eventDates.${index}.eventDate`}
                                                    error={getNestedFormikError(
                                                        touched?.eventDateBlocks?.at(blockIndex)
                                                            ?.eventDates,
                                                        errors?.eventDateBlocks?.at(blockIndex)
                                                            ?.eventDates,
                                                        index,
                                                        'eventDate'
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <CmtTextField
                                                    value={item.annotation}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label={'Annotation'}
                                                    name={`eventDateBlocks.${blockIndex}.eventDates.${index}.annotation`}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="statusDateLabel" size="small">
                                                        Status
                                                    </InputLabel>
                                                    <Select
                                                        labelId="statusDateLabel"
                                                        id="statusDate"
                                                        size="small"
                                                        value={item.state}
                                                        variant="standard"
                                                        label="Status"
                                                        onChange={(e) => {
                                                            setFieldValue(
                                                                `eventDateBlocks.${blockIndex}.eventDates.${index}.state`,
                                                                e.target.value
                                                            );
                                                        }}
                                                    >
                                                        {STATES?.map((item, index) => (
                                                            <MenuItem
                                                                value={item.value}
                                                                key={index}
                                                            >
                                                                <ListItemText>
                                                                    {item.label}
                                                                </ListItemText>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {item?.state === 'delayed' && (
                                                <Grid item xs={12}>
                                                    <CmtDateTimePicker
                                                        fullWidth
                                                        value={item.reportDate}
                                                        disablePast
                                                        setValue={(value) => {
                                                            setFieldValue(
                                                                `eventDateBlocks.${blockIndex}.eventDates.${index}.reportDate`,
                                                                moment(value).format(
                                                                    'YYYY-MM-DD HH:mm'
                                                                )
                                                            );
                                                        }}
                                                        onTouched={setFieldTouched}
                                                        name={`eventDateBlocks.${blockIndex}.eventDates.${index}.reportDate`}
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>

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
                            </Grid>
                        ))}
                    </Grid>
                    <Box pt={4} pl={4} display="flex" justifyContent={'flex-end'}>
                        <AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                                push({
                                    eventDate: '',
                                    annotation: '',
                                    state: '',
                                    reportDate: '',
                                });
                            }}
                        >
                            <AddIcon /> Ajouter
                        </AddBlockButton>
                    </Box>
                </Box>
            )}
        </FieldArray>
    );
};
