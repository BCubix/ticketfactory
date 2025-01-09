import React, { useState, useMemo } from 'react';
import { Grid, Paper, Zoom } from '@mui/material';
import { format, getDaysInMonth, getDay, sub, startOfMonth, parse, add, startOfDay, startOfWeek, getWeeksInMonth, isSameDay } from 'date-fns';
import SchedulerToolbar from './Toolbar.jsx';
import MonthModeView from './MonthModeView.jsx';
import WeekModeView from './WeekModeView.jsx';
import DayModeView from './DayModeView.jsx';

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

const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => translations[day]);

// Helper functions
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
// End helper functions

export const CmtCalendar = ({ values, setFieldValue, setGenerateDate, options, toolbarProps, STATES, ...restProps }) => {
    const today = new Date();

    const [selectedDay, setSelectedDay] = useState(today);
    const [mode, setMode] = useState(options?.defaultMode || 'month');
    const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(today));
    const [selectedDate, setSelectedDate] = useState(format(today, 'MMMM-yyyy'));

    const filterEventsForDate = (date) => {
        return values?.eventDates?.filter((event) => {
            let eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm:ss', new Date());
            if (isNaN(eventDate.getTime())) {
                eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm', new Date());
            }

            return isSameDay(date, eventDate);
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

    const getMonthHeader = () => {
        return weekDays.map((day, i) => ({
            id: `row-day-header-${i + 1}`,
            flex: 1,
            sortable: false,
            editable: false,
            align: 'center',
            headerName: day,
            headerAlign: 'center',
            field: `rowday${i + 1}`,
            headerClassName: 'scheduler-theme--header',
        }));
    };

    const getMonthRows = () => {
        let rows = [];
        let daysBefore = [];
        const iteration = getWeeksInMonth(selectedDay);
        const monthStartDate = startOfMonth(selectedDay);
        const monthStartDay = (getDay(monthStartDate) || 7) - 1;
        let dateDay = parseInt(format(monthStartDate, 'dd'));

        // Add days from the previous month to complete the first week
        for (let i = 0; i < monthStartDay; i++) {
            const subDate = sub(monthStartDate, { days: monthStartDay - i });
            const day = parseInt(format(subDate, 'dd'));
            const data = filterEventsForDate(subDate);
            daysBefore.push({
                id: `day_-${day}`,
                day,
                date: subDate,
                data,
            });
        }

        if (daysBefore.length > 0) {
            rows.push({ id: 0, days: daysBefore });
        }

        // Add current month's days
        for (let i = 0; i < iteration; i++) {
            let week = [];

            for (let j = 0; j < (i === 0 ? 7 - daysBefore.length : 7) && dateDay <= daysInMonth; j++) {
                const date = parse(`${dateDay}-${selectedDate}`, 'dd-MMMM-yyyy', new Date());

                const data = filterEventsForDate(date);

                week.push({
                    id: `day_${dateDay}`,
                    date,
                    data,
                    day: dateDay,
                });

                dateDay++;
            }

            if (i === 0 && daysBefore.length > 0) {
                rows[0].days = rows[0].days.concat(week);
                continue;
            }

            if (week.length > 0) {
                rows.push({ id: i, days: week });
            }
        }

        // Add days from the next month to complete the last week
        const lastRow = rows[rows.length - 1];
        const lastRowDaysDiff = 7 - lastRow.days.length;
        if (lastRowDaysDiff > 0) {
            const lastDate = lastRow.days[lastRow.days.length - 1].date;
            for (let i = 0; i < lastRowDaysDiff; i++) {
                const nextDate = add(lastDate, { days: i + 1 });
                const day = parseInt(format(nextDate, 'dd'));
                const data = filterEventsForDate(nextDate);

                lastRow.days.push({
                    id: `day_${day}`,
                    date: nextDate,
                    day,
                    data,
                });
            }
        }

        return rows;
    };

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

    const getWeekRows = () => {
        let data = [];
        let dayStartHour = startOfDay(selectedDay);

        for (let i = 1; i <= HOURS; i++) {
            let id = `line_${i}`;
            let label = format(dayStartHour, 'HH:mm aaa');

            let obj = { id: id, label: label, days: [] };
            let columns = getWeekHeader();

            columns.map((column, index) => {
                let matchedEvents = filterEventsForDate(column.date) || [];
                let schedule = Array(4).fill(0);

                matchedEvents.forEach((event) => {
                    let eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm:ss', new Date());
                    if (isNaN(eventDate.getTime())) {
                        eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm', new Date());
                    }

                    let endTime = add(eventDate, { minutes: values.eventLength || 60 });

                    if (isSameDay(column?.date, eventDate) && eventDate.getHours() <= (i - 1) % HOURS && endTime.getHours() >= (i - 1) % HOURS) {
                        schedule = calculateHour(eventDate, endTime, i, HOURS);
                    }
                });

                obj.days.push({
                    id: `column-${index}_m-${column.month}_d-${column.day}_${id}`,
                    date: column?.date,
                    data: matchedEvents,
                    schedule: schedule,
                });
            });

            data.push(obj);
            dayStartHour = add(dayStartHour, { minutes: 60 });
        }

        return data;
    };

    const getDayRows = () => {
        const HOURS = 24;
        let data = [];
        let dayStartHour = startOfDay(selectedDay);

        for (let i = 0; i <= HOURS; i++) {
            let id = `line_${i}`;
            let label = format(dayStartHour, 'HH:mm aaa');

            if (i > 0) {
                let obj = { id: id, label: label, days: [] };
                let column = getDayHeader(selectedDay)[0];
                let matchedEvents = filterEventsForDate(column.date) || [];
                let schedule = Array(4).fill(0);

                // Schedule and event logic remains the same
                matchedEvents.forEach((event) => {
                    let eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm:ss', new Date());
                    if (isNaN(eventDate.getTime())) {
                        eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm', new Date());
                    }

                    let endTime = add(eventDate, { minutes: values.eventLength });

                    if (isSameDay(column?.date, eventDate) && eventDate.getHours() <= (i - 1) % HOURS && endTime.getHours() >= (i - 1) % HOURS) {
                        schedule = calculateHour(eventDate, endTime, i, HOURS);
                    }
                });

                obj.days.push({
                    id: `column-_m-${column?.month}_d-${column?.day}_${id}`,
                    date: column?.date,
                    data: matchedEvents,
                    schedule: schedule,
                });

                data.push(obj);
                dayStartHour = add(dayStartHour, { minutes: 60 });
            }
        }
        return data;
    };

    // DayMode Matrix changes
    const dayRow = useMemo(() => [...getDayRows()], [values, selectedDay, mode]);
    const dayColumn = useMemo(() => [...getDayHeader(selectedDay)], [selectedDay]);
    // WeekMode Matrix changes
    const weekRow = useMemo(() => {
        return getWeekRows();
    }, [values, selectedDay, mode]);
    const weekColumn = useMemo(() => [...getWeekHeader()], [selectedDay]);
    // MonthMode Matrix changes
    const monthRow = useMemo(() => {
        return getMonthRows();
    }, [values, selectedDay, mode]);
    const monthColumn = useMemo(() => [...getMonthHeader()], [selectedDay]);

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
