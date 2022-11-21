import React from 'react';
import { FieldArray } from 'formik';
import moment from 'moment';

import { useTheme } from '@emotion/react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
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
    FormHelperText,
    Typography,
} from '@mui/material';

import { Component } from "@/AdminService/Component";
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

export const EventsDateForm = ({
    values,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    touched,
    errors,
    blockIndex,
    setGenerateDate,
}) => {
    const theme = useTheme();

    const STATES = [
        { label: 'Valide', value: 'valid', color: theme.palette.dateStatus.valid },
        { label: 'Reporté', value: 'delayed', color: theme.palette.dateStatus.reported },
        { label: 'Annulé', value: 'canceled', color: theme.palette.dateStatus.canceled },
        { label: 'Nouvelle date', value: 'new_date', color: theme.palette.dateStatus.newDate },
    ];

    const DAYS_WEEK = [
        { label: 'L', color: '#4a148c', value: 'lundi' },
        { label: 'M', color: '#0d47a1', value: 'mardi' },
        { label: 'M', color: '#006664', value: 'mercredi' },
        { label: 'J', color: '#33691e', value: 'jeudi' },
        { label: 'V', color: '#f57f17', value: 'vendredi' },
        { label: 'S', color: '#e65100', value: 'samedi' },
        { label: 'D', color: '#b71c1c', value: 'dimanche' },
    ];

    const DisplayBadge = ({ item }) => {
        if (!item?.eventDate) {
            return <></>;
        }

        const day = DAYS_WEEK.find((el) => el.value === moment(item.eventDate).format('dddd'));
        if (!day) {
            return <></>;
        }

        return (
            <Box
                height={30}
                width={30}
                display="flex"
                alignItems="center"
                justifyContent="center"
                backgroundColor={day.color}
                borderRadius="50%"
                marginRight={3}
                flexShrink={0}
            >
                <Typography component="span" color="white" variant="h4">
                    {day.label}
                </Typography>
            </Box>
        );
    };

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
                                            <Grid item xs={12} display="flex" alignItems="center">
                                                <DisplayBadge item={item} />
                                                <Component.CmtDateTimePicker
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
                                                <Component.CmtTextField
                                                    value={item.annotation}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label={'Annotation'}
                                                    name={`eventDateBlocks.${blockIndex}.eventDates.${index}.annotation`}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormControl
                                                    fullWidth
                                                    error={Boolean(
                                                        getNestedFormikError(
                                                            touched?.eventDateBlocks?.at(blockIndex)
                                                                ?.eventDates,
                                                            errors?.eventDateBlocks?.at(blockIndex)
                                                                ?.eventDates,
                                                            index,
                                                            'state'
                                                        )
                                                    )}
                                                >
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
                                                                    <Box
                                                                        display={'inline'}
                                                                        borderRadius={4}
                                                                        px={2}
                                                                        py={1}
                                                                        mx={1}
                                                                        backgroundColor={item.color}
                                                                    >
                                                                        {item.label}
                                                                    </Box>
                                                                </ListItemText>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText error>
                                                        {getNestedFormikError(
                                                            touched?.eventDateBlocks?.at(blockIndex)
                                                                ?.eventDates,
                                                            errors?.eventDateBlocks?.at(blockIndex)
                                                                ?.eventDates,
                                                            index,
                                                            'state'
                                                        )}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>

                                            {item?.state === 'delayed' && (
                                                <Grid item xs={12}>
                                                    <Component.CmtDateTimePicker
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
                                                        error={getNestedFormikError(
                                                            touched?.eventDateBlocks?.at(blockIndex)
                                                                ?.eventDates,
                                                            errors?.eventDateBlocks?.at(blockIndex)
                                                                ?.eventDates,
                                                            index,
                                                            'reportDate'
                                                        )}
                                                    />
                                                </Grid>
                                            )}
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
                        </Component.AddBlockButton>

                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                                setGenerateDate(blockIndex);
                            }}
                            sx={{ marginLeft: 3 }}
                        >
                            <LibraryAddIcon /> Générer
                        </Component.AddBlockButton>
                    </Box>
                </Box>
            )}
        </FieldArray>
    );
};
