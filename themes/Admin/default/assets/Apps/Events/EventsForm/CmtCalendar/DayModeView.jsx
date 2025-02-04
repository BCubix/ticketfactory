import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { format, addMinutes, getDaysInMonth, getDay, sub, startOfMonth, parse, add, startOfDay, startOfWeek, getWeeksInMonth, isSameDay } from 'date-fns';

import { Paper, Typography, Table, TableBody, TableCell, Tooltip, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Component } from '@/AdminService/Component';
import { v4 as uuidv4 } from 'uuid';
import { StyledTableCell, StyledTableContainer, DayModeStyledCell, SlotDiv } from './sc.DayModeView';
import EventAddSpecialPricing from './../EventAddSpecialPricing';
    
const calculateHour = (eventDate, endTime, hour, totalHours) => {
    return Array(4)
        .fill(0)
        .map((_, quarter) => {
            const quarterStart = 15 * quarter;
            const quarterEnd = 15 * (quarter + 1);

            if (eventDate.getHours() === endTime.getHours()) {
                return eventDate.getMinutes() <= quarterStart && endTime.getMinutes() >= quarterEnd ? 1 : 0;
            }

            if (eventDate.getHours() === (hour - 1) % totalHours && eventDate.getMinutes() <= quarterStart) return 1;
            if (endTime.getHours() === (hour - 1) % totalHours && endTime.getMinutes() >= quarterEnd) return quarter === 3 && endTime.getMinutes() < 59 ? 0 : 1;
            if (eventDate.getHours() < (hour - 1) % totalHours && endTime.getHours() > (hour - 1) % totalHours) return 1;

            return 0;
        });
};
// SlotDiv Component

const DayModeView = ({ editable, values, columns, rows, options, setFieldValue, setGenerateDate, STATES, touched, errors, ...restProps }) => {
    const theme = useTheme();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogItemIndex, setDialogItemIndex] = useState(null);
    const [creatingItem, setCreatingItem] = useState(false);

    useEffect(() => {
        if (!creatingItem) handleCloseDialog();
    }, [creatingItem]);

    const filterEventsForDate = (date) => {
        return values?.eventDates?.filter((event) => {
            let eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm:ss', new Date());
            if (isNaN(eventDate.getTime())) {
                eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm', new Date());
            }

            return isSameDay(date, eventDate);
        });
    };
    
    const handleCellClick = (rowIndex, dayIndex) => {
        if (!editable) {
            return;
        }
        const dayData = rows[rowIndex].days[dayIndex].data;
        const itemIndex = dayData?.[0]?.index ?? values.eventDates.length;

        if (!dayData || dayData.length === 0) {
            setCreatingItem(true);
            const currentCell = new Date(rows[rowIndex].days[dayIndex]?.date);
            currentCell.setHours(rowIndex);
            const formattedDate = format(currentCell, 'yyyy-MM-dd HH:mm:ss');
            setFieldValue(`eventDates.${itemIndex}`, {
                eventDate: formattedDate,
                annotation: '',
                state: 'valid',
                reportDate: '',
                index: itemIndex,
                eventDateUuid: uuidv4(),
            });
        }

        setDialogItemIndex(itemIndex);
        setDialogOpen(true);
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

    const handleCloseDialog = () => {
        if (creatingItem) {
            const updatedEventDate = [...values.eventDates];
            updatedEventDate.splice(dialogItemIndex, 1);
            setFieldValue('eventDates', updatedEventDate);
        }
        setCreatingItem(false);
        setDialogOpen(false);
        setDialogItemIndex(null);
    };

    const handleSubmitForm = () => setCreatingItem(false);
    
    return (
        <>
            <StyledTableContainer component={Paper} sx={{ maxHeight: options?.maxHeight || 540 }}>
                <Table size="small" aria-label="simple table" stickyHeader sx={{ minWidth: options.minWidth || 540 }}>
                    <TableHead sx={{ height: 24 }}>
                        <TableRow>
                            <TableCell align="left" />
                            {columns?.map((column, index) => (
                                <TableCell align="center" key={`weekday-${column?.day}-${index}`}>
                                    {column?.weekDay}. {column?.day}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((row, rowIndex) => (
                            <TableRow key={`timeline-${rowIndex}`}>
                                <Tooltip placement="right" title={`${row.days?.reduce((prev, curr) => prev + curr?.data?.length, 0)} event(s) on this week timeline`}>
                                    <StyledTableCell scope="row" align="center" component="th">
                                        <Typography variant="body2">{row?.label}</Typography>
                                    </StyledTableCell>
                                </Tooltip>
                                {row?.days?.map((day, dayIndex) => (
                                    <DayModeStyledCell key={day?.id} align="center" onClick={() => handleCellClick(rowIndex, dayIndex)}>
                                        {day?.schedule?.map(
                                            (slot, slotIndex) =>
                                                slot === 1 && (
                                                    <SlotDiv
                                                        key={`slot-${slotIndex}`}
                                                        slotIndex={slotIndex}
                                                        color={
                                                            day.data[0]?.state ? STATES.find((state) => state.value === day.data[0]?.state)?.color : theme.palette.dateStatus.valid
                                                        }
                                                        onClick={() => handleCellClick(rowIndex, dayIndex)}
                                                    />
                                                )
                                        )}
                                    </DayModeStyledCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>

            {editable && (
                <Dialog open={dialogOpen} onClose={handleCloseDialog} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                    <Component.DeleteBlockFabButton size="small" onClick={handleCloseDialog}>
                        <CloseIcon />
                    </Component.DeleteBlockFabButton>
                    <DialogTitle>{creatingItem ? 'Ajouter un evenement' : 'Modifier un evenement'}</DialogTitle>
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
                            {...restProps}
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
            )}
        </>
    );
};

export default DayModeView;
