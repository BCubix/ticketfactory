import React from 'react';
import { Chart } from 'react-google-charts';


const GraphChildrenDashboard = ({ values }) => {
    return (
        <Chart
            chartType='LineChart'
            width='100%'
            height='400px'
            data={[['Date', 'Valeur'], ...Object.entries(values)]}
            options={{
                curveType: 'function',
                legend: { position: 'bottom' },
                chartArea: {
                    width: '100%',
                },
                width: '100%',
            }}
        />
    );
};

export default GraphChildrenDashboard;
