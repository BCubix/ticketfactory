import React, { useEffect, useState, useMemo } from 'react';

import { Component } from '@/AdminService/Component';
import moment from 'moment';
import { Box } from '@mui/system';
import { TimelineConnector, TimelineDot } from '@mui/lab';
import { Popover, Typography } from '@mui/material';
import { HistoryDateTypo } from './sc.CmtHistoryDate';

const getHistoryDates = (historyList) => {
    let historyDates = [];

    historyList.forEach((element) => {
        let elementDate = moment(element.revisionDate);
        let index = historyDates.findIndex((e) => e.date === elementDate.format('DD-MM-YYYY'));

        if (index > -1) {
            historyDates.at(index).history.push(element);
        } else {
            historyDates.push({
                date: elementDate.format('DD-MM-YYYY'),
                history: [element],
            });
        }
    });

    return historyDates;
};

const getRangeDateIndex = (rangeDate, selectedHistory) => {
    let selected = null;

    rangeDate.forEach((element, index) => {
        let result = element.history.find((el) => el.id === selectedHistory.id);

        if (result) {
            selected = index;
        }
    });

    return selected;
};

const DisplayTimelineConnector = ({ rangeDate, index }) => {
    const actualDate = moment(rangeDate.at(index).date, 'DD-MM-YYYY');
    const nextDate = moment(rangeDate.at(index + 1).date, 'DD-MM-YYYY');
    const difference = Math.abs(nextDate.diff(actualDate, 'days'));

    if (difference > 7) {
        return (
            <Box position="relative" display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}>
                <TimelineConnector sx={{ height: '3px', marginLeft: 3, width: '30px' }} />
                <Typography
                    sx={{
                        borderRadius: 1,
                        backgroundColor: (theme) => theme.palette.secondary.main,
                        padding: 1,
                        marginInline: 1,
                        color: (theme) => theme.palette.secondary.contrastText,
                        width: 45,
                        textAlign: 'center',
                        fontSize: 12,
                    }}
                >
                    {difference}
                </Typography>
                <TimelineConnector sx={{ height: '3px', width: '30px' }} />
            </Box>
        );
    }
    return <TimelineConnector sx={{ height: '3px', marginLeft: 3, width: difference * 15 }} onClick={(e) => e.stopPropagation()} />;
};

export const CmtHistoryDate = ({ historyList, selectedHistory, setSelectedHistory }) => {
    const rangeDate = useMemo(() => getHistoryDates(historyList), [historyList]);
    const [selectedDate, setSelectedDate] = useState(getRangeDateIndex(rangeDate, historyList.at(selectedHistory)));
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const container = document.getElementById('timelineContainer');
        container.scrollLeft = container.scrollLeftMax / 2;
    }, []);

    const handleClick = (e, item, index) => {
        if (item?.history?.length) {
            setAnchorEl(e.currentTarget);
            if (selectedDate !== index) {
                setSelectedHistory(historyList.findIndex((element) => element.id === item?.history?.at(0).id));
            }
        }

        if (selectedDate !== index) {
            setSelectedDate(index);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'selectHistory-popover' : undefined;

    return (
        <Component.CmtCard sx={{ minHeight: 100, width: '100%', overflowX: 'hidden' }}>
            <Box display="flex" justifyContent={'center'} id="timelineContainer" alignItems="center" sx={{ marginBlock: 5, overflowX: 'auto', width: '100%', padding: 5 }}>
                {rangeDate?.map((item, index) => (
                    <Box key={index} onClick={(e) => handleClick(e, item, index)} id={`timelineItem-${index}`}>
                        <Box
                            sx={{
                                backgroundColor: (theme) => theme.palette.primary.main,
                                height: 20,
                                width: 20,
                                marginLeft: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '2px',
                                cursor: 'pointer',
                            }}
                        >
                            <Typography sx={{ color: (theme) => theme.palette.primary.contrastText }}>{item.history.length}</Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <TimelineDot sx={{ marginLeft: 3, cursor: 'pointer', backgroundColor: (theme) => selectedDate === index && theme.palette.primary.main }} />
                            {index !== rangeDate.length - 1 && <DisplayTimelineConnector rangeDate={rangeDate} index={index} />}
                        </Box>
                        <Typography sx={{ cursor: 'pointer', color: (theme) => selectedDate === index && theme.palette.primary.main }}>
                            {moment(item.date, 'DD-MM-YYYY').format('DD/MM')}
                        </Typography>
                    </Box>
                ))}
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {rangeDate?.at(selectedDate)?.history?.map((item, index) => (
                        <HistoryDateTypo
                            sx={{ paddingInline: 5, paddingBlock: 2 }}
                            key={index}
                            onClick={() => setSelectedHistory(historyList.findIndex((element) => element.id === item.id))}
                            selectedHistory={historyList.at(selectedHistory).id === item.id}
                        >
                            {moment(item.revisionDate).format('DD/MM/YYYY HH:mm')}
                        </HistoryDateTypo>
                    ))}
                </Popover>
            </Box>
        </Component.CmtCard>
    );
};
