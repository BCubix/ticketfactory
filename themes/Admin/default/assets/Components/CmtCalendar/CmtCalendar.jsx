import React, { useState, useMemo } from 'react';
import { Grid, Paper, Zoom } from '@mui/material';
import { format, getDaysInMonth, add, startOfWeek } from 'date-fns';
import SchedulerToolbar from './Toolbar.jsx';
import MonthModeView from './MonthModeView.jsx';
import WeekModeView from './WeekModeView.jsx';
import DayModeView from './DayModeView.jsx';

import { getDayRows, getWeekRows, getMonthRows, getMonthHeader } from './CalenderHelper.js';
// Constants
const HOURS = 24;

const translations = {
    day: 'Jour',
    week: 'Semaine',
    month: 'Mois',
    timeline: 'Chronologie',
    mon: 'LUN',
    tue: 'MAR',
    wed: 'MER',
    thu: 'JEU',
    fri: 'VEN',
    sat: 'SAM',
    sun: 'DIM',
    January: 'janvier',
    February: 'février',
    March: 'mars',
    April: 'avril',
    May: 'mai',
    June: 'juin',
    July: 'juillet',
    August: 'août',
    September: 'septembre',
    October: 'octobre',
    November: 'novembre',
    December: 'décembre',
};

export const CmtCalendar = ({ editable=false, values, tooltip, setFieldValue=null, setGenerateDate=null, options,toolbarProps, STATES, ...restProps }) => {
    const today = new Date();

    const [selectedDay, setSelectedDay] = useState(today);
    const [mode, setMode] = useState(options?.defaultMode || 'month');
    const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(today));
    const [selectedDate, setSelectedDate] = useState(format(today, 'MMMM-yyyy'));
    
    const getWeekHeader = () => {
        const startOfWeekDate = startOfWeek(selectedDay, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => {
            const date = add(startOfWeekDate, { days: i });
            const weekDay = format(date, 'iii').toLowerCase();
            return {
                date,
                weekDay: translations[weekDay],
                day: format(date, 'dd'),
                month: format(date, 'MM'),
            };
        });
    };

    const getDayHeader = (selectedDay) => [
        {
            date: selectedDay,
            weekDay: translations[format(selectedDay, 'iii').toLowerCase()],
            day: format(selectedDay, 'dd'),
            month: format(selectedDay, 'MM'),
        },
    ];

    // DayMode Matrix changes
    const dayRow = useMemo(() => [...getDayRows(values, selectedDay)], [values, selectedDay, mode]);
    const dayColumn = useMemo(() => [...getDayHeader(selectedDay)], [selectedDay]);
    // WeekMode Matrix changes
    const weekRow = useMemo(() => {
        return getWeekRows(values, selectedDay);
    }, [values, selectedDay, mode]);
    const weekColumn = useMemo(() => [...getWeekHeader()], [selectedDay]);
    // MonthMode Matrix changes
    const monthRow = useMemo(() => {
        return getMonthRows(selectedDay, values, daysInMonth, selectedDate);
    }, [values, selectedDay, mode]);
    const monthColumn = useMemo(() => [...getMonthHeader(selectedDay)], [selectedDay]);

    const handleDateChange = (day, date) => {
        setDaysInMonth(day);
        setSelectedDay(date);
        setDaysInMonth(getDaysInMonth(date));
        setSelectedDate(format(date, 'MMMM-yyyy'));
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
    };

    return (
        <Paper variant="outlined" elevation={0} sx={{ p: 0 }}>
            <SchedulerToolbar
                today={today}
                switchMode={mode}
                toolbarProps={toolbarProps}
                onDateChange={handleDateChange}
                onModeChange={handleModeChange}
                translations={translations}
            />
            <Grid container spacing={0} alignItems="center" justifyContent="start">
                {mode === 'month' && (
                    <Zoom in>
                        <Grid item xs={12}>
                            <MonthModeView
                                editable={editable}
                                tooltip={tooltip.tooltip}
                                values={values}
                                setFieldValue={setFieldValue}
                                setGenerateDate={setGenerateDate}
                                rows={monthRow}
                                columns={monthColumn}
                                options={options}
                                STATES={STATES}
                                {...restProps}
                            />
                        </Grid>
                    </Zoom>
                )}
                {mode === 'week' && (
                    <Zoom in>
                        <Grid item xs={12}>
                            <WeekModeView
                                editable={editable}
                                tooltip={tooltip.tooltip}
                                values={values}
                                setFieldValue={setFieldValue}
                                setGenerateDate={setGenerateDate}
                                columns={weekColumn}
                                rows={weekRow}
                                options={options}
                                STATES={STATES}
                                {...restProps}
                            />
                        </Grid>
                    </Zoom>
                )}
                {mode === 'day' && (
                    <Zoom in>
                        <Grid item xs={12}>
                            <DayModeView
                                editable={editable}
                                tooltip={tooltip.tooltip}
                                values={values}
                                setFieldValue={setFieldValue}
                                setGenerateDate={setGenerateDate}
                                options={options}
                                date={selectedDate}
                                rows={dayRow}
                                columns={dayColumn}
                                STATES={STATES}
                                {...restProps}
                            />
                        </Grid>
                    </Zoom>
                )}
            </Grid>
        </Paper>
    );
};
