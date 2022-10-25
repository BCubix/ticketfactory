import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useMemo } from 'react';
import getMenuEntryModules from './getMenuEntryModules';

export const AddMenuElement = ({ addElementToMenu }) => {
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
                {menuEntryModule.map((Item, index) => (
                    <Item key={index} addElementToMenu={addElementToMenu} />
                ))}
            </Box>
        </>
    );
};
