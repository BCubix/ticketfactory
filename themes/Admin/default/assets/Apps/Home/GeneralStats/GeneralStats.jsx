import React, { useEffect, useMemo } from 'react';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';

import { CardContent, Grid } from '@mui/material';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box } from '@mui/system';

import { getGeneralStatsData } from '@Apps/Home/GeneralStats/redux/generalStatsSlice';
import { Component } from '@/AdminService/Component';

export const GeneralStats = ({DATE_FORMAT, generalStats, beginDate, endDate, setBeginDate, setEndDate}) => {

    const dispatch = useDispatch();

    useEffect(() => {
        if (!beginDate || !endDate) return;
        dispatch(getGeneralStatsData(beginDate, endDate));
    }, [dispatch, beginDate, endDate]);

    const graph = useMemo(() => {
        const subscriptions = generalStats.graph?.subscriptions || [];
        const visitors = generalStats.graph?.visitors || [];
        const traffic = generalStats.graph?.traffic || [];

        // Merge the data
        const mergedData = subscriptions.map((sub, index) => ({
            ...sub,
            Abonnés: subscriptions[index]?.['subscriptions'] || 0,
            Traffic: traffic[index]?.['traffic'] || 0,
            Visiteurs: visitors[index]?.['visitors'] || 0
        }));

        return mergedData;
    }, [generalStats]);

    const theme = useTheme();

    const disableEndDateAfterBeginDate = (date) => {
        return endDate && date.isAfter(moment(endDate));
    };

    const disableBeginDateBeforeEndDate = (date) => {
        return beginDate && date.isBefore(moment(beginDate));
    };

    return (
        <>
            <Component.CmtCard>
                <Component.CmtCardHeader title="Statistiques générales" />

                <Grid container spacing={4} sx={{ padding: '10px' }}>
                    <Grid item xs={12} sm={6}>
                        <Component.CmtDatePicker
                            fullWidth
                            value={beginDate}
                            setValue={(newValue) => setBeginDate(moment(newValue).format(DATE_FORMAT))}
                            name={beginDate}
                            label={'Filtrer du'}
                            inputSize="small"
                            shouldDisableDate={disableEndDateAfterBeginDate}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Component.CmtDatePicker
                            fullWidth
                            value={endDate}
                            setValue={(newValue) => setEndDate(moment(newValue).format(DATE_FORMAT))}
                            name={endDate}
                            label={'Au'}
                            inputSize="small"
                            shouldDisableDate={disableBeginDateBeforeEndDate}
                        />
                    </Grid>
                </Grid>

                <CardContent sx={{ padding: 0 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" width="100%" height={300}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={graph} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="1%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                                        <stop offset="99%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="1%" stopColor={theme.palette.secondary.main} stopOpacity={0.4} />
                                        <stop offset="99%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTra" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="1%" stopColor={theme.palette.tertiary.main} stopOpacity={0.4} />
                                        <stop offset="99%" stopColor={theme.palette.tertiary.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    interval={0}
                                    tick={{ fill: theme.palette.primary.main, ...theme.typography.body2 }}
                                />
                                <CartesianGrid vertical={false} />
                                <Tooltip />
                                <Legend wrapperStyle={{...theme.typography.h5 }} />
                                    <Area type="monotone" dataKey="Abonnés" strokeWidth={2} stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorUv)" />
                                    <Area type="monotone" dataKey="Visiteurs" strokeWidth={2} stroke={theme.palette.secondary.main} fillOpacity={1} fill="url(#colorSub)" />
                                    <Area type="monotone" dataKey="Traffic" stokeWidth={2} stroke={theme.palette.tertiary.main} fillOpacity={1} fill="url(#colorTra)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Component.CmtCard>
        </>
    );
};

export default GeneralStats;
