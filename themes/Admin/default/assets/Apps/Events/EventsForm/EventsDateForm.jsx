import React, { useRef } from 'react';
import { FieldArray } from 'formik';
import moment from 'moment';
import { useTheme } from '@emotion/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Card, CardContent, FormControl, Grid, InputLabel, ListItemText, Box, MenuItem, Select, FormHelperText, Typography, Tooltip } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

export const eventsDateFormFields = {
    fields: [
        {
            keyId: 'input-date-datetime',
            style: {
                xs: 12,
                display: 'flex',
                alignItems: 'center',
            },
            component: ({ blockIndex, index, item, touched, errors, setFieldTouched, setFieldValue }) => (
                <>
                    <DisplayBadge item={item} />
                    <Component.CmtDateTimePicker
                        fullWidth
                        value={item.eventDate}
                        disablePast
                        label="Date"
                        id={`eventDateBlocks-${blockIndex}-eventDates-${index}-eventDate`}
                        required
                        setValue={(value) => {
                            setFieldValue(`eventDateBlocks.${blockIndex}.eventDates.${index}.eventDate`, value ? moment(value).format('YYYY-MM-DD HH:mm') : '');
                        }}
                        onTouched={setFieldTouched}
                        name={`eventDateBlocks.${blockIndex}.eventDates.${index}.eventDate`}
                        error={getNestedFormikError(touched?.eventDateBlocks?.at(blockIndex)?.eventDates, errors?.eventDateBlocks?.at(blockIndex)?.eventDates, index, 'eventDate')}
                    />
                </>
            ),
        },
        {
            keyId: 'input-date-annotation',
            style: { xs: 12 },
            input: ({ blockIndex, index, item }) => {
                return {
                    name: `eventDateBlocks.${blockIndex}.eventDates.${index}.annotation`,
                    label: 'Annotation',
                    inputType: 'textField',
                    value: item.annotation,
                };
            },
        },
        {
            keyId: 'input-date-state',
            style: { xs: 12 },
            component: ({ touched, errors, blockIndex, index, item, handleBlur, setFieldValue, states }) => (
                <FormControl
                    fullWidth
                    error={Boolean(getNestedFormikError(touched?.eventDateBlocks?.at(blockIndex)?.eventDates, errors?.eventDateBlocks?.at(blockIndex)?.eventDates, index, 'state'))}
                >
                    <InputLabel id={`eventDateBlocks-${blockIndex}-eventDates-${index}-stateLabel`} required size="small">
                        Status
                    </InputLabel>
                    <Select
                        labelId={`eventDateBlocks-${blockIndex}-eventDates-${index}-stateLabel`}
                        id={`eventDateBlocks-${blockIndex}-eventDates-${index}-state`}
                        size="small"
                        value={item.state}
                        onBlur={handleBlur}
                        name={`eventDateBlocks.${blockIndex}.eventDates.${index}.state`}
                        variant="standard"
                        label="Status"
                        onChange={(e) => {
                            setFieldValue(`eventDateBlocks.${blockIndex}.eventDates.${index}.state`, e.target.value);
                        }}
                    >
                        {states?.map((item, index) => (
                            <MenuItem value={item.value} key={index} id={`eventDateStateValue-${item.value}`}>
                                <ListItemText>
                                    <Box display={'inline'} borderRadius={4} px={2} py={1} mx={1} backgroundColor={item.color}>
                                        {item.label}
                                    </Box>
                                </ListItemText>
                            </MenuItem>
                        ))}
                    </Select>
                    {getNestedFormikError(touched?.eventDateBlocks?.at(blockIndex)?.eventDates, errors?.eventDateBlocks?.at(blockIndex)?.eventDates, index, 'state') && (
                        <FormHelperText error id={`eventDateBlocks-${blockIndex}-eventDates-${index}-state-helper-text`}>
                            {getNestedFormikError(touched?.eventDateBlocks?.at(blockIndex)?.eventDates, errors?.eventDateBlocks?.at(blockIndex)?.eventDates, index, 'state')}
                        </FormHelperText>
                    )}
                </FormControl>
            ),
        },
        {
            keyId: 'input-date-reportDate',
            style: { xs: 12 },
            input: ({ blockIndex, index, item }) =>
                item?.state === 'delayed'
                    ? {
                          name: `eventDateBlocks.${blockIndex}.eventDates.${index}.reportDate`,
                          label: 'Date de report',
                          inputType: 'dateTime',
                          disablePast: true,
                          value: item.reportDate,
                          error: ({ errors, touched }) =>
                              getNestedFormikError(touched?.eventDateBlocks?.at(blockIndex)?.eventDates, errors?.eventDateBlocks?.at(blockIndex)?.eventDates, index, 'reportDate'),
                          setValue: (value, setFieldValue) =>
                              setFieldValue(`eventDateBlocks.${blockIndex}.eventDates.${index}.reportDate`, value ? moment(value).format('YYYY-MM-DD HH:mm') : ''),
                      }
                    : null,
        },
    ],
};

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
        <Box className="badge" backgroundColor={day.color}>
            <Typography component="span" color="white" variant="h4">
                {day.label}
            </Typography>
        </Box>
    );
};

export const EventsDateForm = ({ values, blockIndex, setGenerateDate, ...props }) => {
    const theme = useTheme();
    const index = useRef(values?.eventDateBlocks[blockIndex]?.eventDates?.length || 0);

    const STATES = [
        { label: 'Valide', value: 'valid', color: theme.palette.dateStatus.valid },
        { label: 'Reporté', value: 'delayed', color: theme.palette.dateStatus.reported },
        { label: 'Annulé', value: 'canceled', color: theme.palette.dateStatus.canceled },
        { label: 'Nouvelle date', value: 'new_date', color: theme.palette.dateStatus.newDate },
    ];

    return (
        <FieldArray name={`eventDateBlocks[${blockIndex}].eventDates`}>
            {({ remove, push }) => (
                <Box className="padding-2">
                    <Grid container spacing={6}>
                        {values?.eventDateBlocks[blockIndex]?.eventDates?.map((item, index) => (
                            <Grid item xs={12} md={6} lg={4} xl={3} key={index}>
                                <Card sx={{ marginBlock: 2, overflow: 'visible' }}>
                                    <CardContent sx={{ position: 'relative' }}>
                                        <Grid container spacing={4}>
                                            <Component.CmtDisplayFields
                                                values={values}
                                                blockIndex={blockIndex}
                                                setGenerateDate={setGenerateDate}
                                                item={item}
                                                index={index}
                                                states={STATES}
                                                {...props}
                                            />
                                        </Grid>

                                        {item?.eventRows?.length > 0 ? (
                                            <Tooltip
                                                title={
                                                    item?.eventRows?.length > 0
                                                        ? "Vous ne pouvez pas supprimer cette représentation car des billets ont été vendus. Utilisez la fonction d'annulation."
                                                        : ''
                                                }
                                            >
                                                <Component.DisabledBlockFabButton>
                                                    <DeleteIcon />
                                                </Component.DisabledBlockFabButton>
                                            </Tooltip>
                                        ) : (
                                            <Component.DeleteBlockFabButton
                                                size="small"
                                                onClick={() => {
                                                    remove(index);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Component.DeleteBlockFabButton>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box className="flex row-end padding-top-4 padding-left-4">
                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            id="addDateButton"
                            onClick={() => {
                                push({
                                    eventDate: '',
                                    annotation: '',
                                    state: 'valid',
                                    reportDate: '',
                                    index: index.current,
                                });

                                index.current = index.current + 1;
                            }}
                        >
                            <AddIcon /> Ajouter
                        </Component.AddBlockButton>

                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            id="generateDateButton"
                            onClick={() => {
                                setGenerateDate({ blockIndex, index });
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
