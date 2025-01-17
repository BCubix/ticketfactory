import React, { useRef, useState, useMemo, useCallback } from 'react';
import { FieldArray } from 'formik';
import moment from 'moment';
import { useTheme } from '@emotion/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { ButtonGroup, Card, CardContent, FormControl, Grid, InputLabel, ListItemText, Box, MenuItem, Select, FormHelperText, Typography, Tooltip } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';
import { v4 as uuidv4 } from 'uuid';

import EventAddSpecialPricing from './EventAddSpecialPricing';

export const eventsDateFormFields = {
    fields: [
        {
            keyId: 'input-date-datetime',
            style: {
                xs: 12,
                display: 'flex',
                alignItems: 'center',
            },
            component: ({ index, item, touched, errors, setFieldTouched, setFieldValue }) => (
                <>
                    <DisplayBadge item={item} />
                    <Component.CmtDateTimePicker
                        fullWidth
                        value={item.eventDate}
                        disablePast
                        label="Date"
                        id={`eventDates-${index}-eventDate`}
                        required
                        name={`eventDates.${index}.eventDate`}
                        setValue={(value) => {
                            setFieldValue(`eventDates.${index}.eventDate`, value ? moment(value).format('YYYY-MM-DD HH:mm') : '');
                        }}
                        onTouched={setFieldTouched}
                        error={getNestedFormikError(touched?.eventDates?.at(index), errors?.eventDates?.at(index)?.eventDate, index, 'eventDate')}
                    />
                </>
            ),
        },
        {
            keyId: 'input-date-annotation',
            style: { xs: 12 },
            input: ({ index, item }) => {
                return {
                    name: `eventDates.${index}.annotation`,
                    label: 'Annotation',
                    inputType: 'textField',
                    value: item.annotation,
                };
            },
        },
        {
            keyId: 'input-date-state',
            style: { xs: 12 },
            component: ({ touched, errors, index, item, handleBlur, setFieldValue, states }) => (
                <FormControl fullWidth error={Boolean(getNestedFormikError(touched?.eventDates?.at(index), errors?.eventDates?.at(index), index, 'state'))}>
                    <InputLabel id={`eventDates-${index}-stateLabel`} required size="small">
                        Status
                    </InputLabel>
                    <Select
                        labelId={`eventDates-${index}-stateLabel`}
                        id={`eventDates-${index}-state`}
                        size="small"
                        value={item.state}
                        onBlur={handleBlur}
                        name={`eventDates.${index}.state`}
                        variant="standard"
                        label="Status"
                        onChange={(e) => {
                            setFieldValue(`eventDates.${index}.state`, e.target.value);
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
                    {getNestedFormikError(touched?.eventDates?.at(index), errors?.eventDates?.at(index), index, 'state') && (
                        <FormHelperText error id={`eventDates-${index}-state-helper-text`}>
                            {getNestedFormikError(touched?.eventDates?.at(index), errors?.eventDates?.at(index), index, 'state')}
                        </FormHelperText>
                    )}
                </FormControl>
            ),
        },
        {
            keyId: 'input-date-reportDate',
            style: { xs: 12 },
            input: ({ index, item }) =>
                item?.state === 'delayed'
                    ? {
                          name: `eventDates.${index}.reportDate`,
                          label: 'Date de report',
                          inputType: 'dateTime',
                          disablePast: true,
                          value: item.reportDate,
                          error: ({ errors, touched }) => getNestedFormikError(touched?.eventDates?.at(index), errors?.eventDates?.at(index)?.eventDate, index, 'reportDate'),
                          setValue: (value, setFieldValue) => setFieldValue(`eventDates.${index}.reportDate`, value ? moment(value).format('YYYY-MM-DD HH:mm') : ''),
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

const getDefaultMode = (parameters) => {
    const eventType = parameters?.find((el) => el.paramKey === 'core_default_events_type')?.paramValue || 'Evénements';
    const list = [
        { mode: 'card', eventTypes: ['Pièces', 'Evénements'] },
        { mode: 'week', eventTypes: ['Films', 'Expositions'] },
        { mode: 'month', eventTypes: ['Concerts', 'Ballets'] },
    ];

    const result = list.find((item) => item.eventTypes.includes(eventType));
    if (result) {
        return result.mode;
    }

    return 'day';
};

const DisplayBadge = React.memo(({ item }) => {
    const day = useMemo(() => {
        if (!item?.eventDate) {
            return null;
        }

        return DAYS_WEEK.find((el) => el.value === moment(item.eventDate).format('dddd'));
    }, [item?.eventDate]);

    if (!day) {
        return null;
    }

    return (
        <Box className="badge" backgroundColor={day.color}>
            <Typography component="span" color="white" variant="h4">
                {day.label}
            </Typography>
        </Box>
    );
});

export const EventsDateForm = ({ values, setFieldValue, touched, errors, ...props }) => {
    const theme = useTheme();
    const [generateDate, setGenerateDate] = useState(null);
    const [visionMode, setVisionMode] = useState(getDefaultMode(props.parameters));
    const index = useRef(values?.eventDates?.length || 0);

    const STATES = useMemo(
        () => [
            { label: 'Valide', value: 'valid', color: theme.palette.dateStatus.valid },
            { label: 'Reporté', value: 'delayed', color: theme.palette.dateStatus.reported },
            { label: 'Annulé', value: 'canceled', color: theme.palette.dateStatus.canceled },
            { label: 'Nouvelle date', value: 'new_date', color: theme.palette.dateStatus.newDate },
        ],
        []
    );

    const handleCardViewClick = () => setVisionMode('card');
    const handleMonthViewClick = () => setVisionMode('month');

    const handleAddDate = (push) => {
        push({
            eventDate: '',
            annotation: '',
            state: 'valid',
            reportDate: '',
            index: index.current,
            eventDateUuid: uuidv4(),
        });

        index.current += 1;
    };

    const handleSubmitDateRange = useCallback(
        (newDates) => {
            if (!Array.isArray(newDates)) {
                console.error('submitDateRange expects an array of dates');
                return;
            }
            newDates.forEach((newDate) => {
                setFieldValue(`eventDates.${newDate?.index}`, newDate);
            });
        },
        [setFieldValue]
    );

    return (
        <FieldArray name={`eventDates`}>
            {({ remove, push }) => (
                <Box className="padding-2">
                    <Box>
                        <Box className="block-head">
                            <ButtonGroup variant="contained" color="primary">
                                <Component.ActionButton size="small" color="primary" variant={visionMode === 'card' ? 'outlined' : 'contained'} onClick={handleCardViewClick}>
                                    Carte
                                </Component.ActionButton>
                                <Component.ActionButton size="small" color="primary" variant={visionMode === 'month' ? 'outlined' : 'contained'} onClick={handleMonthViewClick}>
                                    Calendrier
                                </Component.ActionButton>
                            </ButtonGroup>
                        </Box>
                    </Box>

                    {visionMode === 'card' ? (
                        <Grid container spacing={6}>
                            {values?.eventDates?.map((item, index) => (
                                <Grid item xs={12} md={6} lg={4} xl={3} key={index}>
                                    <Card sx={{ marginBlock: 2, overflow: 'visible' }}>
                                        <CardContent sx={{ position: 'relative' }}>
                                            <Grid container spacing={4}>
                                                <Component.CmtDisplayFields
                                                    values={values}
                                                    setGenerateDate={setGenerateDate}
                                                    setFieldValue={setFieldValue}
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

                                            {/* Dialog Button to add special pricing */}
                                            <EventAddSpecialPricing
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                touched={touched}
                                                errors={errors}
                                                selectedDate={item}
                                                {...props}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid>
                            <Component.CmtCalendar
                                values={values}
                                setFieldValue={setFieldValue}
                                setGenerateDate={setGenerateDate}
                                options={{
                                    startWeekOn: 'mon',
                                    defaultMode: visionMode,
                                    minWidth: 540,
                                    maxWidth: 540,
                                    minHeight: 540,
                                    maxHeight: 540,
                                }}
                                toolbarProps={{
                                    showSearchBar: true,
                                    showSwitchModeButtons: true,
                                    showDatePicker: true,
                                }}
                                STATES={STATES}
                                {...props}
                            />
                        </Grid>
                    )}

                    <Box className="flex row-end padding-top-4 padding-left-4">
                        {errors?.eventDates && typeof errors?.eventDates === 'string' && (
                            <FormHelperText error id="eventDateBlocks-helper-text">
                                {errors.eventDates}
                            </FormHelperText>
                        )}
                    </Box>

                    <Box className="flex row-end padding-top-4 padding-left-4">
                        <Component.AddBlockButton size="small" color="primary" variant="outlined" id="addDateButton" onClick={() => handleAddDate(push)}>
                            <AddIcon /> Ajouter
                        </Component.AddBlockButton>

                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            id="generateDateButton"
                            onClick={() => {
                                setGenerateDate({ index });
                            }}
                            sx={{ marginLeft: 3 }}
                        >
                            <LibraryAddIcon /> Générer
                        </Component.AddBlockButton>

                        <Component.EventDateRange
                            open={Boolean(generateDate !== null)}
                            setOpen={setGenerateDate}
                            index={generateDate?.index}
                            submitDateRange={(newDates) => handleSubmitDateRange(newDates)}
                        />
                    </Box>
                </Box>
            )}
        </FieldArray>
    );
};
