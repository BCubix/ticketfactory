import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { Grid } from '@mui/material';
import { dashboardSelector, getDashboardAction } from '@Redux/dashboard/dashboardSlice';
import FirstCardDashboard from '@Apps/Home/FirstCardDashboard';
import ThirdCardDashboard from '@Apps/Home/ThirdCardDashboard';

const MainDashboard = () => {
    const { loading, dashboard, error } = useSelector(dashboardSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!loading && !dashboard && !error) {
            dispatch(getDashboardAction());
        }
    }, []);

    return (
        <CmtPageWrapper title={'Tableau de bord'}>
            { dashboard && (
                <Grid container spacing={2} sx={{ marginTop: 0 }}>
                    <Grid item xs={12} md={4} lg={3}>
                        <FirstCardDashboard data={ dashboard.col1 }/>
                    </Grid>
                    <Grid item xs={12} md={8} lg={7}></Grid>
                    <Grid item xs={12} md={2} lg={2}>
                        <ThirdCardDashboard data={ dashboard.col3 }/>
                    </Grid>
                </Grid>
            )}
        </CmtPageWrapper>
    );
};

export default MainDashboard;