import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

const MENU_TYPE = 'external';
const MENU_TYPE_LABEL = 'Liens externe';

export const MenuEntryModule = ({ addElementToMenu, editMode, setValue, element, errors }) => {
    const [name, setName] = useState('');
    const [initialValue, setInitialValue] = useState('');

    const handleSubmitLink = () => {
        if (!name || !initialValue) {
            return;
        }

        addElementToMenu([
            {
                name: name,
                value: initialValue,
                menuType: MENU_TYPE,
                children: [],
            },
        ]);

        setName('');
        setInitialValue('');
    };

    if (editMode) {
        return <Component.CmtTextField value={element.value} onChange={(e) => setValue(e.target.value)} label="Lien" />;
    }

    return (
        <Accordion
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmitLink();
                }
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="external-links-menus-elements-header">
                <Typography>Liens externe</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Component.CmtTextField value={name} onChange={(e) => setName(e.target.value)} label="Nom de l'élément" id={`externalLinksMenuEntry-name`} />

                <Component.CmtTextField value={initialValue} onChange={(e) => setInitialValue(e.target.value)} label="Lien" id={`externalLinksMenuEntry-link`} />

                <Box display="flex" justifyContent={'flex-end'}>
                    <Button variant="contained" disabled={!name || !initialValue} onClick={handleSubmitLink} id={`externalLinksMenuEntrySubmit`}>
                        Ajouter
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default {
    MenuEntryModule,
    MENU_TYPE,
};
