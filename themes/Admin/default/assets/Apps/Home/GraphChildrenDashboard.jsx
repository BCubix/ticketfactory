import React from 'react';
import moment from 'moment';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';
import { useTheme } from '@emotion/react';

export const GraphChildrenDashboard = ({ values }) => {
    const theme = useTheme();

    return (
        <ResponsiveContainer height={120}>
            <AreaChart
                data={[...Object.entries(values).map(([key, value]) => ({ key: moment(key).format('DD-MM-YYYY'), value: value }))]}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="1%" stopColor={theme.palette.primary.light} />
                        <stop offset="99%" stopColor="#ffffff" />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="6 1 2" horizontal={false} strokeOpacity={0.7} />
                <XAxis dataKey="key" hide />
                <Area type="monotone" dataKey={'value'} stackId="2" strokeWidth={2} fillOpacity={0.7} stroke={theme.palette.primary.main} fill="url(#colorUv)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};
