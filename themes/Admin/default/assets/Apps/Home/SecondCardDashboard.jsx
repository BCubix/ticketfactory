import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

import { useTheme } from '@emotion/react';

import { Button, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const SecondCardDashboard = ({ data }) => {
    const theme = useTheme();
    const colorProps = theme.palette.primary.main;

    const dispatch = useDispatch();

    const [beginDate, setBeginDate] = useState(moment(data.params?.beginDate).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(data.params?.endDate).format('YYYY-MM-DD'));

    const [graph, setGraph] = useState(data.graph?.values);
    const [tab, setTab] = useState(data.graph?.tab);

    async function getGraph(tab, beginDate, endDate) {
        apiMiddleware(dispatch, async () => {
            const result = await Api.dashboardApi.getGraph(tab, beginDate, endDate);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            setGraph(result.dashboard?.graph);
        });
    }

    useEffect(() => {
        if (!tab || !beginDate || !endDate) return;

        getGraph(tab, beginDate, endDate);
    }, [tab, beginDate, endDate]);

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
                                setValue={(newValue) => {
                                    setBeginDate(moment(newValue).format('YYYY-MM-DD'));
                                }}
                                name={beginDate}
                                label={'Filtrer du'}
                                inputSize="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Component.CmtDatePicker
                                fullWidth
                                value={endDate}
                                setValue={(newValue) => {
                                    setEndDate(moment(newValue).format('YYYY-MM-DD'));
                                }}
                                name={endDate}
                                label={'Au'}
                                inputSize="small"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Component.CmtCard>

            <Component.CmtCard>
                <Component.CmtCardHeader title="Statistiques" />

                <Grid container spacing={0} sx={{ backgroundColor: '#F7F7F7', paddingTop: -15 }}>
                    {Object.entries(data.numbers).map(([tabName, val], index) => {
                        return (
                            <Grid key={index} item xs={4} sm={3} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="text"
                                    onClick={() => setTab(tabName)}
                                    fullWidth
                                    color="secondary"
                                    sx={{
                                        borderBottomRightRadius: tab === tabName && 0,
                                        borderBottomLeftRadius: tab === tabName && 0,
                                        borderBottom: (theme) => (tab === tabName ? `1px solid ${theme.palette.primary.main}` : 'none'),
                                        color: (theme) => (tab === tabName ? theme.palette.primary.main : colorProps),
                                    }}
                                >
                                    <Box>
                                        <Component.GraphTabTitle variant="h6">{val.label}</Component.GraphTabTitle>
                                        <Typography variant="body1" fontSize={10} fontWeight={500}>
                                            {val.amount} {val.unit}
                                        </Typography>
                                    </Box>
                                </Button>
                            </Grid>
                        );
                    })}
                </Grid>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        {graph?.values && (
                            <Box sx={{ width: '100%' }}>
                                <Component.GraphChildrenDashboard values={graph.values} />
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Component.CmtCard>
        </>
    );
};
