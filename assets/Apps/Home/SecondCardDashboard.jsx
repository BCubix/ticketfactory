import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

import { Card, CardContent, FormControlLabel, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { REDIRECTION_TIME } from '@/Constant';
import { loginFailure } from '@Redux/profile/profileSlice';
import authApi from '@Services/api/authApi';
import dashboardApi from '@Services/api/dashboardApi';

import { CmtTabs } from '@Components/CmtTabs/CmtTabs';
import { CmtDatePicker } from '@Components/CmtDatePicker/CmtDatePicker';

import { FieldFormControl } from '@Apps/ContentTypes/ContentTypesForm/sc.ContentTypeFields';
import GraphChildrenDashboard from '@Apps/Home/GraphChildrenDashboard';

function SecondCardDashboard({ data }) {
    const dispatch = useDispatch();

    const [beginDate, setBeginDate] = useState(moment(data.params?.beginDate)
        .format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(data.params?.endDate).format('YYYY-MM-DD'));

    const [graph, setGraph] = useState(data.graph?.values);
    const [tab, setTab] = useState(data.graph?.tab);

    async function getGraph(tab, beginDate, endDate) {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));
            return;
        }

        const result = await dashboardApi.getGraph(tab, beginDate, endDate);

        if (!result.result) {
            NotificationManager.error('Une erreur s\'est produite', 'Erreur', REDIRECTION_TIME);
            return;
        }

        setGraph(result.dashboard?.graph);
    }

    useEffect(() => {
        if (!tab || !beginDate || !endDate)
            return;

        getGraph(tab, beginDate, endDate);
    }, [tab, beginDate, endDate]);

    return (
        <Card>
            <CardContent>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <FieldFormControl fullWidth>
                        <FormControlLabel
                            control={
                                <CmtDatePicker
                                    fullWidth
                                    value={beginDate}
                                    setValue={(newValue) => {
                                        setBeginDate(moment(newValue).format('YYYY-MM-DD'));
                                    }}
                                    name={beginDate}
                                />
                            }
                            label={'Date minimum'}
                            labelPlacement='start'
                        />
                    </FieldFormControl>
                    <FieldFormControl fullWidth>
                        <FormControlLabel
                            control={
                                <CmtDatePicker
                                    fullWidth
                                    value={endDate}
                                    setValue={(newValue) => {
                                        setEndDate(moment(newValue).format('YYYY-MM-DD'));
                                    }}
                                    name={endDate}
                                />
                            }
                            label={'Date maximum'}
                            labelPlacement='start'
                        />
                    </FieldFormControl>
                    <Box sx={{ width: '100%' }}>
                        {graph?.values && (
                            <CmtTabs
                                tabValue={graph.values.length}
                                list={[
                                    ...Object.keys(data.numbers).map((tabName) => {
                                        return {
                                            label: (
                                                <Box>
                                                    <Typography variant='h5'>{tabName}</Typography>
                                                    <Typography variant='body1'>{data.numbers[tabName]}</Typography>
                                                </Box>
                                            ),
                                            component: <GraphChildrenDashboard values={graph.values} />,
                                            changeFunction: () => {
                                                setTab(tabName);
                                            },
                                        };
                                    }),
                                ]}
                            />
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default SecondCardDashboard;
