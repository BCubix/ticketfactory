import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';

function TabPanel(props) {
    const { children, value, index, label, ...other } = props;

    return (
        <Box hidden={value !== index} id={`tab-${label}`} aria-labelledby={`${label}`} {...other}>
            {value === index && children}
        </Box>
    );
}

export const CmtTabs = ({ list, tabValue = 0, containerStyle = {} }) => {
    const [value, setValue] = useState(tabValue);
    const navigate = useNavigate();

    return (
        <Box sx={containerStyle}>
            <Box sx={{ borderBottom: 1, borderBottom: 'none', backgroundColor: (theme) => theme.palette.secondary.light }}>
                <Tabs
                    value={value}
                    onChange={(_, newValue) => {
                        setValue(newValue);
                    }}
                    aria-label="Panel"
                >
                    {list
                        ?.filter((el) => !el.hidden)
                        ?.map((item, index) => (
                            <Tab
                                label={item.label}
                                id={item.id || item.label}
                                key={index}
                                onClick={() => {
                                    if (item.path) {
                                        navigate(item.path);
                                    }

                                    if (item.changeFunction) {
                                        item.changeFunction();
                                    }
                                }}
                                disabled={item.disabled}
                            />
                        ))}
                </Tabs>
            </Box>

            {list
                ?.filter((el) => !el.hidden)
                ?.map((item, index) => (
                    <TabPanel value={value} index={index} key={index} label={item.label}>
                        {item.component}
                    </TabPanel>
                ))}
        </Box>
    );
};
