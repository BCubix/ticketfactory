import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, parse, isValid, isSameMonth, addMinutes } from 'date-fns';
import { Component } from '@/AdminService/Component';
import CloseIcon from '@mui/icons-material/Close';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { CustomTableCell, CustomTableContainer, DayLabel, SelectedTimeBox, CustomPaper } from './sc.MonthModeView';
import EventAddSpecialPricing from './../EventAddSpecialPricing';

const MonthModeView = (props) => {
    const { values, setFieldValue, setGenerateDate, rows, columns, errors, touched, options, STATES, ...restProps } = props;

    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(true);
    const [dialogItemIndex, setDialogItemIndex] = useState(null);
    const [creatingItem, setCreatingItem] = useState(false);

    const today = new Date();

    // Use useMemo to calculate selectedData
    const selectedData = useMemo(() => {
        if (!selectedDay) return [];

        const selectedDayDate = format(new Date(selectedDay.date), 'yyyy-MM-dd');

        const filteredData = values.eventDates.filter((event) => {
            let parsedDate = null;
            try {
                parsedDate = parse(event.eventDate, 'yyyy-MM-dd HH:mm:ss', new Date());
                if (!isValid(parsedDate)) {
                    parsedDate = parse(event.eventDate, 'yyyy-MM-dd HH:mm', new Date());
                }
            } catch (error) {
                return false;
            }

            if (isValid(parsedDate)) {
                const eventDateFormatted = format(parsedDate, 'yyyy-MM-dd');
                return eventDateFormatted === selectedDayDate;
            }

            return false;
        });

        return filteredData;
    }, [selectedDay, values.eventDates]);

    useEffect(() => {
        if (!creatingItem) {
            handleCloseDialog();
        }
    }, [creatingItem]);

    const handleAddDateClick = () => {
        const index = values.eventDates.length;

        setDialogItemIndex(index);
        setFieldValue(`eventDates.${index}`, {
            eventDate: '',
            annotation: '',
            state: 'valid',
            reportDate: '',
            index: index,
            eventDateUuid: uuidv4(),
        });
        setCreatingItem(true);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        if (creatingItem && dialogItemIndex !== null) {
            const updatedEventDate = [...values.eventDates];
            updatedEventDate.splice(dialogItemIndex, 1);
            setFieldValue('eventDates', updatedEventDate);
        }
        setCreatingItem(false);
        setDialogOpen(false);
        setDialogItemIndex(null);
    };

    const handleSubmitForm = () => {
        setCreatingItem(false);
        setDialogOpen(false);
    };

    const handleDeleteItem = () => {
        if (dialogItemIndex !== null) {
            const updatedEventDate = [...values.eventDates];
            updatedEventDate.splice(dialogItemIndex, 1);
            setFieldValue('eventDates', updatedEventDate);
        }
        setCreatingItem(false);
        setDialogOpen(false);
        setDialogItemIndex(null);
    };

    const handleCellClick = (day, rowId) => {
        setSelectedDay({ ...day, rowId });
        setSelectedTime(null);
    };

    const handleTimeClick = (time, item) => {
        setSelectedTime(item);

        const index = item?.index;

        setCreatingItem(false);
        setDialogItemIndex(index);
        setDialogOpen(true);
    };

    return (
        <Box>
            <CustomTableContainer component={Paper}>
                <Table size="small" aria-label="simple table" stickyHeader sx={{ minWidth: options?.minWidth || 650 }}>
                    <TableHead sx={{ height: 34 }}>
                        <TableRow>
                            {columns?.map((column, index) => (
                                <TableCell align="center" key={column?.headerName + '-' + index}>
                                    {column?.headerName}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((row, rowIndex) => (
                            <TableRow key={`row-${row.id}-${rowIndex}`}>
                                {row?.days?.map((day, dayIndex) => {
                                    const currentDay = day.day === today.getUTCDate() && isSameMonth(day.date, today);
                                    const isSelectedDay = selectedDay?.day === day.day && selectedDay?.date === day.date;
                                    return (
                                        <CustomTableCell
                                            scope="row"
                                            align="center"
                                            component="th"
                                            onClick={() => handleCellClick(day, rowIndex)}
                                            isSelectedDay={isSelectedDay}
                                            key={`day-${day.id}`}
                                        >
                                            <Box sx={{ height: '100%', overflowY: 'visible' }}>
                                                <DayLabel variant="body2" isCurrentDay={currentDay}>
                                                    {day.day}
                                                </DayLabel>
                                            </Box>
                                        </CustomTableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CustomTableContainer>

            <CustomPaper>
                {selectedData.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {selectedData.map((item, index) => {
                            const parsedDate = new Date(item.eventDate);
                            if (isNaN(parsedDate)) {
                                console.error('Invalid date format for eventDate:', item.eventDate);
                                return null;
                            }

                            const time = format(parsedDate, 'HH:mm');
                            const eventLength = values.eventLength || 0;
                            const endTime = format(addMinutes(parsedDate, eventLength), 'HH:mm');
                            const isSelectedTime = selectedTime === time;

                            return (
                                <SelectedTimeBox key={`selected-time-${index}`} onClick={() => handleTimeClick(time, item)} isSelectedTime={isSelectedTime}>
                                    {time} - {endTime}
                                </SelectedTimeBox>
                            );
                        })}
                    </Box>
                )}
                <Button onClick={handleAddDateClick}>Ajouter une date</Button>
            </CustomPaper>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        overflow: 'visible',
                    },
                }}
            >
                <DialogTitle>{creatingItem ? 'Ajouter un evenement' : 'Modifier un evenement'}</DialogTitle>
                <Component.DeleteBlockFabButton
                    size="small"
                    onClick={() => {
                        handleCloseDialog();
                    }}
                >
                    <CloseIcon />
                </Component.DeleteBlockFabButton>

                <DialogContent>
                    {dialogItemIndex !== null && (
                        <Component.CmtDisplayFields
                            values={values}
                            setGenerateDate={setGenerateDate}
                            setFieldValue={setFieldValue}
                            item={values.eventDates[dialogItemIndex]}
                            index={dialogItemIndex}
                            states={STATES}
                            {...restProps}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <EventAddSpecialPricing
                        values={values}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        errors={errors}
                        selectedDate={values.eventDates[dialogItemIndex]}
                        {...props}
                    />
                    {!creatingItem && (
                        <Button onClick={handleDeleteItem} color="error">
                            Supprimer
                        </Button>
                    )}
                    <Button onClick={handleSubmitForm} color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MonthModeView;
