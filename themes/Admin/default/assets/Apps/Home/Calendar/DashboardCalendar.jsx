import React from 'react';
import { Grid } from '@mui/material';
import { Component } from '@/AdminService/Component';

import { useTheme } from '@emotion/react';

export const DashboardCalendar = ({loading, calendar, tooltip, error}) => {
    const theme = useTheme();
    
    const STATES = [
        { label: 'Valide', value: 'valid', color: theme.palette.dateStatus.valid },
        { label: 'Reporté', value: 'delayed', color: theme.palette.dateStatus.reported },
        { label: 'Annulé', value: 'canceled', color: theme.palette.dateStatus.canceled },
        { label: 'Nouvelle date', value: 'new_date', color: theme.palette.dateStatus.newDate },
    ];

    return (
        <Grid item xs={12}>
            <Component.CmtCard>
                <Component.CmtCardHeader title="Prochains événements" />
                    <Component.CmtCalendar
                        editable={false}
                        values={{ eventDates: calendar[0] }}
                        tooltip={{ tooltip }}
                        options={{
                            startWeekOn: 'mon',
                            defaultMode: 'week',
                            minWidth: 540,
                            maxWidth: 540,
                            minHeight: 540,
                            maxHeight: 540,
                        }}
                        toolbarProps={{
                            showSearchBar: true,
                            showSwitchModeButtons: true,
                            showDatePicker: true,
                        }}
                        STATES={STATES}
                    />
            </Component.CmtCard>
        </Grid>
    );
};
