import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import getMenuEntryModules from '@Apps/Menus/MenusList/getMenuEntryModules';
import { NoClickableMenuEntry } from './NoClickableMenuEntry';

export const AddMenuElement = ({ addElementToMenu, language }) => {
    const menuEntryModule = useMemo(() => {
        const menuEntries = getMenuEntryModules();
        let modules = [];

        Object.entries(menuEntries).map(([name, value]) => {
            const Component = (value && value?.MenuEntryModule) || null;
            if (!Component) {
                throw `Le module ${name} n'existe pas ou est corrompu`;
            }

            modules.push(Component);
        });

        return modules;
    }, []);

    return (
        <>
            <Typography component="h2" variant="h4">
                Ajouter des éléments de menu
            </Typography>

            <Box marginTop={4}>
                <NoClickableMenuEntry addElementToMenu={addElementToMenu} />
                {menuEntryModule.map((Item, index) => (
                    <Item key={index} addElementToMenu={addElementToMenu} language={language} />
                ))}
            </Box>
        </>
    );
};
