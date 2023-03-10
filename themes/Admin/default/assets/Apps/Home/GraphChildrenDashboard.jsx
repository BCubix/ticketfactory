import React from 'react';
import { Chart } from 'react-google-charts';
import moment from 'moment';
import { useTheme } from '@emotion/react';

export const GraphChildrenDashboard = ({ values }) => {
    const theme = useTheme();

    return (
        <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={[
                ['Date', 'Valeur'],
                ...Object.entries(values).map(([key, value]) => [
                    moment(key).format('DD-MM-YYYY'),
                    value,
                ]),
            ]}
            options={{
                curveType: 'function',
                chartArea: {
                    width: '100%',
                },
                width: '100%',
                colors: [theme.palette.tertiary.main],
                legend: { position: 'none' },
            }}
        />
    );
};
