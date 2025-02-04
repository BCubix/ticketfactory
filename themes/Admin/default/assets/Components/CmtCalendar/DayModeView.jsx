import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Table, TableBody, TableCell, Tooltip, TableHead, TableRow,  } from '@mui/material';
import { StyledTableCell, StyledTableContainer, DayModeStyledCell } from './sc.DayModeView';
import {SlotWithTooltip } from './CalenderHelper.js'

const DayModeView = ({ editable, tooltip, values, columns, rows, options, setFieldValue, setGenerateDate, STATES, touched, errors, ...restProps }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    return (
        <>
            <StyledTableContainer component={Paper} sx={{ maxHeight: options?.maxHeight || 540 }}>
                <Table size="small" aria-label="simple table" stickyHeader sx={{ minWidth: options.minWidth || 540 }}>
                    <TableHead sx={{ height: 24 }}>
                        <TableRow>
                            <TableCell align="left" sx={{ width: '30%' }} />
                            {columns?.map((column, index) => (
                                <TableCell align="center" key={`weekday-${column?.day}-${index}`} sx={{ width: `calc((100% - 30%) / ${columns.length})` }}>
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
                                     <DayModeStyledCell
                                     key={day?.id}
                                     align="center"
                                 >
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

export default DayModeView;
