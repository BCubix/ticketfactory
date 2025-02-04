import React, { useState, useMemo } from 'react';
import { format, parse, isValid, isSameMonth, addMinutes } from 'date-fns';
import { Paper, Table, TableBody, TableCell, TableRow, TableHead, Box } from '@mui/material';
import { CustomTableCell, CustomTableContainer, DayLabel, CustomPaper } from './sc.MonthModeView';
import { MonthTooltip } from './CalenderHelper.js';

const MonthModeView = (props) => {
    const { editable, tooltip, values, setFieldValue, setGenerateDate, rows, columns, errors, touched, options, STATES, ...restProps } = props;

    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

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

    const handleCellClick = (day, rowId) => {
        setSelectedDay({ ...day, rowId });
        setSelectedTime(null);
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
                            const eventLength = item?.event?.eventLength || 0;
                            const endTime = format(addMinutes(parsedDate, eventLength), 'HH:mm');
                            const isSelectedTime = selectedTime === time;

                            return (
                                <MonthTooltip key={`selected-time-${index}`} item={{ ...item, time, endTime }} tooltip={tooltip} isSelectedTime={isSelectedTime} index={index} />
                            );
                        })}
                    </Box>
                )}
            </CustomPaper>
        </Box>
    );
};

export default MonthModeView;
