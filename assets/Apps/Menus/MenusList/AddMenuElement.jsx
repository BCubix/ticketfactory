import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useMemo } from 'react';
import getMenuEntryModules from './getMenuEntryModules';

export const AddMenuElement = () => {
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

        return <Component />;
    };

    return (
        <>
            <Typography component="h2" variant="h3">
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
