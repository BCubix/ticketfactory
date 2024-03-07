import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';

function TabPanel(props) {
    const { children, value, index, label, mountComponents, ...other } = props;

    return (
        <Box hidden={value !== index} id={`tab-${label}`} aria-labelledby={`${label}`} {...other}>
            {mountComponents ? children : value === index && children}
        </Box>
    );
}

export const CmtTabs = ({ list, mountComponents, tabValue = 0, setTabValue = null, containerStyle = {} }) => {
    const [value, setValue] = useState(tabValue);
    const navigate = useNavigate();

    useEffect(() => {
        if (tabValue !== value) {
            setValue(tabValue);
        }
    }, [tabValue]);

    if (list.length === 1) {
        const TabComponent = list[0];
        return TabComponent.component;
    }

    return (
        <Box sx={containerStyle}>
            <Box sx={{ borderBottom: 1, borderBottom: 'none', backgroundColor: (theme) => theme.palette.secondary.light }}>
                <Tabs
                    value={value}
                    onChange={(_, newValue) => {
                        setValue(newValue);
                        if (setTabValue) {
                            setTabValue(newValue);
                        }
                    }}
                    aria-label="Panel"
                >
                    {list
                        ?.filter((el) => !el.hidden)
                        ?.map((item, index) => (
                            <Tab
                                label={item.label}
                                id={item.id || item.label}
                                className="js-tab-button"
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
                    <TabPanel mountComponents={mountComponents} value={value} index={index} key={index} label={item.label} className={`js-tab-content`}>
                        {item.component}
                    </TabPanel>
                ))}
        </Box>
    );
};
