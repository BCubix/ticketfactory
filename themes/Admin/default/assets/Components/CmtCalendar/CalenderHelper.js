import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { format, addMinutes, getDaysInMonth, getDay, sub, startOfMonth, parse, add, startOfDay, startOfWeek, getWeeksInMonth, isSameDay } from 'date-fns';

import { Paper, Typography, Tooltip, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

//Helper functions
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

const filterEventsForDate = (date, values) => {
    return values?.eventDates?.filter((event) => {
        let eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm:ss', new Date());
        if (isNaN(eventDate.getTime())) {
            eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm', new Date());
        }

        return isSameDay(date, eventDate);
    });
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getDateText = (startDate, endDate) => {
    if (startDate === endDate) {
        return 'Date unique: ' + formatDate(startDate);
    }
    return 'Dates: ' + formatDate(startDate) + ' au ' + formatDate(endDate);
};

const getPriceText = (minPrice, maxPrice) => {
    if (minPrice === maxPrice) {
        return 'Tarif unique: ' + minPrice + ' €';
    }
    return 'Fourchette de prix: de ' + minPrice + ' € à ' + maxPrice + ' €';
};

const getWeekHeader = (selectedDay) => {
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

export const getMonthHeader = (day) => {
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

const getLuminance = (hexColor) => {
    hexColor = hexColor.replace('#', '');

    const r = parseInt(hexColor.substr(0, 2), 16) / 255;
    const g = parseInt(hexColor.substr(2, 2), 16) / 255;
    const b = parseInt(hexColor.substr(4, 2), 16) / 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance;
    };

const getTextColor = (backgroundColor) => {
    const luminance = getLuminance(backgroundColor);
    return luminance > 0.85 ? 'grey' : 'white';
};
//End helper functions

//Calculation  for calendar functions
export const getDayRows = (values, selectedDay) => {
        const HOURS = 24;
        let data = [];
        let dayStartHour = startOfDay(selectedDay);

        //step1 setting up the matrix
        for (let i = 0; i < HOURS; i++) {
            let id = `line_${i}`;
            let label = format(dayStartHour, 'HH:mm aaa');

            let obj = { id: id, label: label, days: [] };
            let column = { date: selectedDay, month: format(selectedDay, 'MM'), day: format(selectedDay, 'dd') };

            obj.days.push({
                id: `column-_m-${column?.month}_d-${column?.day}_${id}`,
                date: column?.date,
                hour: i,
                slots: [],
                schedule: Array(4).fill(0),
            });

            data.push(obj);
            dayStartHour = addMinutes(dayStartHour, 60);
        }

        for (let objIndex = 0; objIndex < data.length; objIndex++) {
            const obj = data[objIndex];
            const days = obj.days;
        
            for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
                const day = days[dayIndex];
                let matchedEvents = filterEventsForDate(day.date, values) || [];
                const i = day?.hour;
        
                for (let eventIndex = 0; eventIndex < matchedEvents.length; eventIndex++) {
                    const event = matchedEvents[eventIndex];
                    let eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm:ss', new Date());
                    if (isNaN(eventDate.getTime())) {
                        eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm', new Date());
                    }
        
                    const eventLength = event?.event?.eventLength || 60;
                    let endTime = add(eventDate, { minutes: eventLength });
        
                    if (eventDate.getHours() <= (i) % HOURS && endTime.getHours() >= (i) % HOURS) {
        
                        const schedule = calculateHour(eventDate, endTime, i, HOURS);
                        const numberOfSlots = Math.ceil(eventLength / 15);
                        const startTimeIndex = Math.floor((eventDate.getHours() % 1 * 4) + Math.floor(eventDate.getMinutes() / 15));
        
                        if (eventDate.getHours() === i) {
                            day.slots.push({
                                numberOfSlots: numberOfSlots,
                                event: event?.event,
                                startTimeIndex: startTimeIndex,
                                widthStartIndex: day.schedule[startTimeIndex],
                            });
                            
                            let objIndexAux = objIndex;
                            let scheduleToChange = day.schedule;
                            let quarter = startTimeIndex;
                            while (quarter < startTimeIndex + numberOfSlots) {
                                scheduleToChange[(quarter % 4)] += 1;
                                quarter++;
                                if (quarter % 4 === 0) {
                                    objIndexAux+=1;
                                    if (objIndexAux > 23)
                                    {
                                        break;
                                    }
                                    scheduleToChange = data[objIndexAux].days[dayIndex].schedule
                                    // Im going to fix it later keep it as is
                                }
                            }
                        }
                    }
                }
            }
        }
        return data;
    };

export const getWeekRows = (values, selectedDay) => {
    const HOURS = 24;
    let data = [];
    let dayStartHour = startOfDay(selectedDay);

    for (let i = 1; i <= HOURS; i++) {
        let id = `line_${i}`;
        let label = format(dayStartHour, 'HH:mm aaa');

        let obj = { id: id, label: label, days: [] };
        let columns = getWeekHeader(selectedDay);

        columns.map((column, index) => {
            obj.days.push({
                id: `column-${index}_m-${column.month}_d-${column.day}_${id}`,
                date: column?.date,
                hour: i,
                slots: [],
                schedule:  Array(4).fill(0),
            });
        });
        
        data.push(obj);
        dayStartHour = add(dayStartHour, { minutes: 60 });
    }
    for (let objIndex = 0; objIndex < data.length; objIndex++) {
        const obj = data[objIndex];
        const days = obj.days;
        
        for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
            const day = days[dayIndex];
                
            let matchedEvents = filterEventsForDate(day.date, values) || [];
            const i = day?.hour;

            matchedEvents.forEach((event) => {
                let eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm:ss', new Date());
                if (isNaN(eventDate.getTime())) {
                    eventDate = parse(event?.eventDate, 'yyyy-MM-dd HH:mm', new Date());
                }

                const eventLength = event?.event?.eventLength || 60;
                let endTime = add(eventDate, { minutes: eventLength });

                if (eventDate.getHours() <= (i) % HOURS && endTime.getHours() >= (i) % HOURS) {
                    const schedule = calculateHour(eventDate, endTime, i, HOURS);
                    const numberOfSlots = Math.ceil(eventLength / 15);
                    const startTimeIndex = Math.floor((eventDate.getHours() % 1 * 4) + Math.floor(eventDate.getMinutes() / 15));
                    if (eventDate.getHours() === i) {
                        day.slots.push({
                            numberOfSlots: numberOfSlots,
                            event: event?.event,
                            startTimeIndex: startTimeIndex,
                            widthStartIndex: day.schedule[startTimeIndex],
                        })
                            
                        let objIndexAux = objIndex;
                        let scheduleToChange = day.schedule;
                        let quarter = startTimeIndex;
                        while (quarter < startTimeIndex + numberOfSlots) {
                            scheduleToChange[(quarter % 4)] += 1;
                            quarter++;
                            if (quarter % 4 === 0) {
                                objIndexAux+=1;
                                if (objIndexAux >= data.length)
                                {
                                    break;
                                }
                                scheduleToChange = data[objIndexAux].days[dayIndex].schedule
                            }
                        }
                    }
                }
            });
        };        
    }
    return data;
};

export const getMonthRows = (selectedDay, values, daysInMonth, selectedDate) => {
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

//End calculation  for calendar functions

//Components functions
export const SlotWithTooltip = ({ scheduleIndex, slot, tooltip, day}) => {
    const dateText = getDateText(tooltip[slot?.event?.id][0][0], tooltip[slot?.event?.id][0][1]);
    const priceText = getPriceText(tooltip[slot?.event?.id][1][0], tooltip[slot?.event?.id][1][1]);
    const backgroundColor = slot?.event?.mainCategory?.color || '#2E71B3';
    const textColor = getTextColor(backgroundColor);

    const index = slot.startTimeIndex;
    if (scheduleIndex !== index)
    {
        return;
    }
    const heightPercentage = (slot?.numberOfSlots /4) * 100;
    const totalDivider = day.schedule[slot.startTimeIndex];

    let beginLeftPercentage = (slot?.widthStartIndex * 20) % 100;
    let widthPercentage = 100 - beginLeftPercentage;
    return (
        <Tooltip
            placement="right"
            title={
                <React.Fragment>
                    <Typography>Titre: {slot?.event?.name || ""}</Typography>
                    <Typography>{dateText}</Typography>
                    <Typography>{priceText}</Typography>
                    <Button
                        variant="text" size="small"
                        onClick={() => navigate(`/admin/evenements/${slot.event.id}/modifier`)}
                    >
                        Voir plus
                    </Button>
                </React.Fragment>
            }
            componentsProps={{
                tooltip: {
                    sx: {
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '10px',
                        borderRadius: '4px',
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                    },
                },
            }}
        >
            <Box
                sx={{
                    height: `${heightPercentage}%`,
                    width: `${widthPercentage}%`,
                    left: `${beginLeftPercentage}%`,
                    borderRadius: '6px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: day.schedule[slot.startTimeIndex],
                    backgroundColor,
                    overflow: 'visible',
                    border: `2px solid ${textColor}`,
                }}
                style={{ left: `${beginLeftPercentage}%`, top: `${index * 25}%`,}}
            >
                 <Typography
                    size='small'
                    style={{
                        position: 'absolute',
                        top: '1px',
                        left: '1px',
                        color: textColor,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        textAlign: 'left',
                        padding: '2px',
                    }}
                >
                    {slot?.event?.name}
                </Typography>

            </Box>
        </Tooltip>
    );
};


export const MonthTooltip = ({ item, tooltip, isSelectedTime, index }) => {
    const navigate = useNavigate();

    const dateText = getDateText(tooltip[item?.event?.id][0][0], tooltip[item?.event?.id][0][1]);
    const priceText = getPriceText(tooltip[item?.event?.id][1][0], tooltip[item?.event?.id][1][1]);
    const backgroundColor = item?.event?.mainCategory?.color || '#2E71B3';
    return (
        <Tooltip
            placement="right"
            title={
                <React.Fragment>
                    <Typography>Titre: {item?.event?.name || ""}</Typography>
                    <Typography>{dateText}</Typography>
                    <Typography>{priceText}</Typography>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/admin/evenements/${item.event.id}/modifier`)}
                    >
                        Voir plus
                    </Button>
                </React.Fragment>
            }
            componentsProps={{
                tooltip: {
                    sx: {
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '10px',
                        borderRadius: '4px',
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                    },
                },
            }}
        >
            <Box key={`selected-time-${index}`}sx={{
                    padding: "7px",
                    backgroundColor: backgroundColor,
                    borderRadius: '8px',
                }}>
                <Typography>{item?.event?.name}</Typography>
                <Typography size="small">{item.time} - {item.endTime}</Typography>
            </Box>
        </Tooltip>
    );
};

//End component functions
