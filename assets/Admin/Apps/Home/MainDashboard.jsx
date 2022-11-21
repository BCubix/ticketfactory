import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { Component } from "@/AdminService/Component";
import { dashboardSelector, getDashboardAction } from '@Redux/dashboard/dashboardSlice';

export const MainDashboard = () => {
    const { loading, dashboard, error } = useSelector(dashboardSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!loading && !dashboard && !error) {
            dispatch(getDashboardAction());
        }
    }, []);

    return (
        <Component.CmtPageWrapper title={'Tableau de bord'}>
            {dashboard && (
                <Grid container spacing={4} sx={{ marginTop: 0 }}>
                    <Grid item xs={12} md={4} lg={3}>
                        <Component.FirstCardDashboard data={dashboard.col1} />
                    </Grid>
                    <Grid item xs={12} md={8} lg={7}>
                        <Component.SecondCardDashboard data={dashboard.col2} />
                    </Grid>
                    <Grid item xs={12} md={2} lg={2}>
                        <Component.ThirdCardDashboard data={dashboard.col3} />
                    </Grid>
                </Grid>
            )}
        </Component.CmtPageWrapper>
    );
};
