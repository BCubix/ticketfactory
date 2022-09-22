import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useMemo } from 'react';
import getMenuEntryModules from './getMenuEntryModules';

export const AddMenuElement = ({ addElementToMenu }) => {
    const menuEntryModule = useMemo(() => {
        return getMenuEntryModules();
    }, []);

    const MenuEntryModulesComponent = ({ name }) => {
        const Component =
            (menuEntryModule && menuEntryModule[name] && menuEntryModule[name]?.MenuEntryModule) ||
            null;

        if (!Component) {
            throw `Le module ${name} n'existe pas ou est corrompu`;
        }

        return <Component addElementToMenu={addElementToMenu} />;
    };

    return (
        <>
            <Typography component="h2" variant="h4">
                Ajouter des éléments de menu
            </Typography>

            <Box marginTop={4}>
                {Object.entries(menuEntryModule).map(([name], index) => (
                    <MenuEntryModulesComponent key={index} name={name} />
                ))}
            </Box>
        </>
    );
};
