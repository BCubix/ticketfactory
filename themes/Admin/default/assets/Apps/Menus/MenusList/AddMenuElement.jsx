import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { NoClickableMenuEntry } from './NoClickableMenuEntry';

export const AddMenuElement = ({ addElementToMenu, language, formCrud }) => {
    const menuEntryModule = useMemo(() => {
        return formCrud.menuEntries;
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
                        return <Item.MenuEntry key={index} addElementToMenu={addElementToMenu} language={language} />;
                    })}
            </Box>
        </>
    );
};
