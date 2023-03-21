import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { NoClickableMenuEntry } from './NoClickableMenuEntry';
import getMenuEntryModules from './getMenuEntryModules';

export const AddMenuElement = ({ addElementToMenu, language }) => {
    const menuEntryModule = useMemo(() => {
        const modules = getMenuEntryModules();
        return modules;
    }, []);

    return (
        <>
            <Typography component="h2" variant="h4">
                Ajouter des éléments de menu
            </Typography>

            <Box marginTop={4}>
                <NoClickableMenuEntry addElementToMenu={addElementToMenu} />
                {menuEntryModule &&
                    Object.entries(menuEntryModule)?.map(([_, Item], index) => {
                        return <Item.MenuEntryModule key={index} addElementToMenu={addElementToMenu} language={language} />;
                    })}
            </Box>
        </>
    );
};
