import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, Tooltip, TableHead, TableRow } from '@mui/material';
import { StyledTableContainer, StyledTableCell, DayModeStyledCell } from './sc.WeekModeView';
import {SlotWithTooltip } from './CalenderHelper.js'

const WeekModeView = (props) => {
    const { editable, values, tooltip, setFieldValue, setGenerateDate, columns, rows, options, STATES, errors, touched, ...restProps } = props;

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
                                    <DayModeStyledCell key={day?.id} align="center">
                                        {day?.schedule?.map(
                                            (schedule, scheduleIndex) => {
                                                return day?.slots?.map((slot, slotIndex) => {
                                                    if (scheduleIndex !== slot.startTimeIndex) return null;
                                                    return <SlotWithTooltip scheduleIndex={scheduleIndex} key={slotIndex} slot={slot} day={day} tooltip={tooltip} />;
                                                })
                                            })
                                        }
                                    </DayModeStyledCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>

        </>
    );
};

export default WeekModeView;
