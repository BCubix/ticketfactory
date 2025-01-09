import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';

import { Button, CardContent, Grid } from '@mui/material';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/system';

import { getGeneralStatsData } from '@Apps/Home/GeneralStats/redux/generalStatsSlice';
import { Component } from '@/AdminService/Component';

export const GeneralStats = () => {
    const DEFAULT_TAB = 'visitors';
    const DATE_FORMAT = 'YYYY-MM-DD';

    const dispatch = useDispatch();

    const generalStats = useSelector(state => state?.generalStats?.generalStats || {});
    const loading = useSelector(state => state?.generalStats?.loading);

    const [beginDate, setBeginDate] = useState(
        moment(generalStats?.params?.beginDate || moment().subtract(7, 'days')).format(DATE_FORMAT)
    );
    const [endDate, setEndDate] = useState(
        moment(generalStats?.params?.endDate || moment()).format(DATE_FORMAT)
    );

    const [tab, setTab] = useState(DEFAULT_TAB);

    useEffect(() => {
        dispatch(getGeneralStatsData(null, null));
    }, [dispatch]);

    useEffect(() => {
        if (!beginDate || !endDate) return;
        dispatch(getGeneralStatsData(beginDate, endDate));
    }, [dispatch, beginDate, endDate]);

    const graph = useMemo(() => {
        return generalStats.graph?.[tab] || [];
    }, [generalStats, tab]);

    const theme = useTheme();
    const colorProps = theme.palette.primary.main;

    const disableEndDateAfterBeginDate = (date) => {
        return endDate && date.isAfter(moment(endDate));
    };

    const disableBeginDateBeforeEndDate = (date) => {
        return beginDate && date.isBefore(moment(beginDate));
    };
    

    if (loading || !generalStats.graph) {
        return <div>Chargement...</div>;
    }

    return (
        <>
            <Component.CmtCard sx={{ marginBottom: 4 }}>
                <Component.CmtCardHeader title="Période sélectionnée" />
                <CardContent>
                    <Grid container spacing={4}>
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
                </CardContent>
            </Component.CmtCard>

            <Component.CmtCard>
                <Grid container spacing={0} sx={{ backgroundColor: '#F7F7F7', paddingTop: -15 }}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {Object.entries(generalStats.numbers).map(([tabName, val], index) => (
                            <Button
                                key={index}
                                variant="text"
                                onClick={() => setTab(tabName)}
                                fullWidth
                                color="secondary"
                                sx={{
                                    borderBottomRightRadius: tab === tabName && 0,
                                    borderBottomLeftRadius: tab === tabName && 0,
                                    borderBottom: (theme) =>
                                        tab === tabName ? `1px solid ${theme.palette.tertiary.main}` : 'none',
                                    color: (theme) => (tab === tabName ? theme.palette.tertiary.main : colorProps),
                                }}
                            >
                                <Box>
                                    <Component.GraphTabTitle variant="h6">{val.label}</Component.GraphTabTitle>
                                </Box>
                            </Button>
                        ))}
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
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    interval={0} 
                                    tick={{ fill: theme.palette.primary.main, ...theme.typography.body2 }}
                                />
                                <CartesianGrid vertical={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="nombre de visiteurs" strokeWidth={2} stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Component.CmtCard>
        </>
    );
};
