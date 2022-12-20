import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

const MENU_TYPE = 'externalLink';
const MENU_TYPE_LABEL = 'Liens externe';

export const MenuEntryModule = ({ addElementToMenu }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');

    const handleSubmitLink = () => {
        if (!name || !value) {
            return;
        }

        addElementToMenu([
            {
                name: name,
                value: value,
                menuType: MENU_TYPE,
                children: [],
            },
        ]);

        setName('');
        setValue('');
    };

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

                <Component.CmtTextField value={value} onChange={(e) => setValue(e.target.value)} label="Lien" id={`externalLinksMenuEntry-link`} />

                <Box display="flex" justifyContent={'flex-end'}>
                    <Button variant="contained" disabled={!name || !value} onClick={handleSubmitLink} id={`externalLinksMenuEntrySubmit`}>
                        Ajouter
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default {
    MenuEntryModule,
};
