import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid} from '@mui/material';

import moment from 'moment';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';

import { parametersSelector } from '@Apps/Parameters/redux/parameters/parametersSlice';
import { addonVersionsSelector, getAddonVersionsAction } from '@Apps/AddonVersions/redux/addonVersions/addonVersionsSlice';
import { getModulesAction, modulesSelector } from '@Apps/Modules/redux/modules/modulesSlice';
import { getGeneralInfosData, generalInfosSelector } from '@Apps/Home/GeneralInfos/redux/generalInfosSlice';
import { getGeneralStatsData, generalStatsSelector } from '@Apps/Home/GeneralStats/redux/generalStatsSlice';
import { salesStatsSelector, getSalesStatsAction } from '@Apps/Home/SalesStats/redux/salesStats/salesStatsSlice';
import { calendarSelector, getCalendarAction } from '@Apps/Home/Calendar/redux/calendar/calendarSlice';
import { fetchToDoTasks, toDoTasksSelector} from '@Apps/Home/ToDoList/redux/toDoTasksSlice';
import { fetchNotes, notesSelector } from '@Apps/Home/Notes/redux/notesSlice';
import { fetchArticles, articlesSelector } from '@Apps/Home/ArticlesList/redux/articlesSlice';
import { healthStatsSelector, getHealthStatsAction } from '@Apps/Home/HealthStats/redux/healthStats/healthStatsSlice';


export const MainDashboard = () => {
    const DATE_FORMAT = 'YYYY-MM-DD';
    
    const [isMarketplaceConnected, setMarketplaceConnected] = useState(false);
    const [marketplaceDialog, setMarketplaceDialog] = useState(false);
    const dispatch = useDispatch();
    
    const { parameters } = useSelector(parametersSelector);
    const { addonVersionsLoading, addonVersions, addonVersionsError } = useSelector(addonVersionsSelector);
    const { loading, modules, error } = useSelector(modulesSelector);
    const { loadingGeneralInfos, generalInfos, errorGeneralInfos} = useSelector(generalInfosSelector);
    const { generalStatsLoading, generalStats, generalStatsError} = useSelector(generalStatsSelector);
    const { salesStatsLoading, salesStats, salesStatsError } = useSelector(salesStatsSelector);
    const { loadingCalendar, calendar, tooltip, errorCalendar } = useSelector(calendarSelector);
    const { loadingToDo, toDoTasks, errorToDo } = useSelector(toDoTasksSelector);
    const { loadingNotes, notes, errorNotes } = useSelector(notesSelector);
    const { loadingArticles, articles, errorArticles } = useSelector(articlesSelector);
    const { loadingHealthStats, healthStats, errorHealthStats } = useSelector(healthStatsSelector);
       
    useEffect(() => {
        checkMarketplaceConnection();
        
        if (!addonVersionsLoading && !addonVersions && !addonVersionsError) {
            dispatch(getAddonVersionsAction());
        }
        
        if (!loading && !modules && !error) {
            dispatch(getModulesAction());
        }
        
        if (!loadingGeneralInfos && !generalInfos && !errorGeneralInfos) {
            dispatch(getGeneralInfosData());
        }
        
        if (!generalStatsLoading && !generalStats && !generalStatsError) {
            dispatch(getGeneralStatsData(null, null));
        }
        
        if (!salesStatsLoading && !salesStats && !salesStatsError) {
            dispatch(getSalesStatsAction(null, null));
        }
        
        if (!loadingCalendar && !calendar && !tooltip && !errorCalendar) {
                    dispatch(getCalendarAction());
        }
        
        if (!loadingToDo && !toDoTasks && !errorToDo) {
            dispatch(fetchToDoTasks());
        }
        
        if (!loadingNotes && !notes && !errorNotes) {
            dispatch(fetchNotes());
        }
        
        if (!loadingArticles && !articles && !errorArticles) {
            dispatch(fetchArticles());
        }
        
        if (!loadingHealthStats && !healthStats && !errorHealthStats) {
            dispatch(getHealthStatsAction());
        }
    }, []);
    
    const [beginDateGeneralStats, setBeginDateGeneralStats] = useState(
        moment(generalStats?.params?.beginDate || moment().subtract(7, 'days')).format(DATE_FORMAT)
    );
    const [endDateGeneralStats, setEndDateGeneralStats] = useState(
        moment(generalStats?.params?.endDate || moment()).format(DATE_FORMAT)
    );
    
    const [beginDateSalesStats, setBeginDateSalesStats] = useState(
        moment(salesStats?.params?.beginDate || moment().subtract(7, 'days')).format(DATE_FORMAT)
        );
    const [endDateSalesStats, setEndDateSalesStats] = useState(
        moment(salesStats?.params?.endDate || moment()).format(DATE_FORMAT)
    );
    
    useEffect(() => {
        if (!beginDateGeneralStats || !endDateGeneralStats) return;
        dispatch(getGeneralStatsData(beginDateGeneralStats, endDateGeneralStats));
    }, [dispatch, beginDateGeneralStats, endDateGeneralStats]);
    

    const checkMarketplaceConnection = async () => {
        const result = await Api.marketplaceApi.checkIsAuth();
        if (result?.result) {
            setMarketplaceDialog(false);
            setMarketplaceConnected(true);
        }
    };
    
    const notLoaded = !parameters || !healthStats ||!articles || !notes || !toDoTasks || !calendar || !addonVersions || !modules || !generalInfos || !generalStats || !generalStats;
    
    return (
        <Component.CmtPageWrapper
            title={'Tableau de bord'}
            actionButton={
                !isMarketplaceConnected ? (
                    <Component.ActionButton variant="contained" onClick={() => setMarketplaceDialog(true)}>
                        Connexion à la marketplace
                    </Component.ActionButton>
                ) : null
            }
        >
            {
                notLoaded ? (<Component.CmtSkeletonDashboard />) : 
                ( <Grid container spacing={6}  style={{ marginTop: '20px' }}>
                    <Grid item xs={12}>
                        <Component.UpdatesList 
                            parameters={parameters}
                            modules={modules}
                            addonVersions={addonVersions}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Component.GeneralInfos
                            generalInfos={generalInfos}
                        />
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Component.LatestOrderList />
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Component.GeneralStats 
                            generalStats={generalStats}
                            beginDate={beginDateGeneralStats}
                            endDate={endDateGeneralStats}
                            setBeginDate={setBeginDateGeneralStats}
                            setEndDate={setEndDateGeneralStats}
                            DATE_FORMAT={DATE_FORMAT}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Component.DashboardCalendar 
                            loading={loadingCalendar}
                            calendar={calendar}
                            tooltip={tooltip}
                            error={error}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Component.SalesStats 
                            DATE_FORMAT={DATE_FORMAT}
                            salesStats={salesStats}
                            beginDate={beginDateSalesStats}
                            endDate={endDateSalesStats}
                            setBeginDate={setBeginDateSalesStats}
                            setEndDate={setEndDateSalesStats}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Component.HealthStats 
                            healthStats={healthStats}
                        />
                    </Grid>

                    <Grid item xs={12} md={3.5}>
                        <Component.ToDoList 
                            toDoTasks={toDoTasks}
                            error={errorToDo}
                            loading={loadingToDo}
                        />
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Component.ArticlesList
                            news={articles}
                        />
                    </Grid>

                    <Grid item xs={12} md={3.5}>
                        <Component.NotesList
                            note={notes}
                            loading={loadingNotes}
                            error={errorNotes}
                        />
                    </Grid>
                    
                </Grid>)
            }
                

            {!isMarketplaceConnected && (
                <Component.MarketplaceConnectionDialog
                    open={marketplaceDialog}
                    onCancel={() => setMarketplaceDialog(false)}
                    onConnected={() => {
                        setMarketplaceDialog(false);
                        setMarketplaceConnected(true);

                        dispatch(getAddonVersionsAction());
                    }}
                />
            )}

            
        </Component.CmtPageWrapper>
    );
};
