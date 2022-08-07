import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TabPanel(props) {
    const { children, value, index, label, ...other } = props;

    return (
        <Box hidden={value !== index} id={`tab-${label}`} aria-labelledby={`${label}`} {...other}>
            {value === index && children}
        </Box>
    );
}

export const CmtTabs = ({ list, tabValue = 0 }) => {
    const [value, setValue] = useState(tabValue);
    const navigate = useNavigate();

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: '#E8E8E8' }}>
                <Tabs
                    value={value}
                    onChange={(_, newValue) => {
                        setValue(newValue);
                    }}
                    aria-label="Panel"
                >
                    {list?.map((item, index) => (
                        <Tab
                            label={item.label}
                            id={item.label}
                            key={index}
                            onClick={() => {
                                if (item.path) {
                                    navigate(item.path);
                                }
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {list?.map((item, index) => (
                <TabPanel value={value} index={index} key={index} label={item.label}>
                    {item.component}
                </TabPanel>
            ))}
        </Box>
    );
};
