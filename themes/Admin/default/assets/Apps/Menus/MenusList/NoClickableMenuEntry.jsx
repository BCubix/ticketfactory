import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

const MENU_TYPE = 'none';

export const NoClickableMenuEntry = ({ addElementToMenu }) => {
    const [name, setName] = useState('');

    const handleSubmitLink = () => {
        if (!name) {
            return;
        }

        addElementToMenu([
            {
                name: name,
                value: null,
                menuType: MENU_TYPE,
                children: [],
            },
        ]);

        setName('');
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
                <Typography>Elément non cliquable</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Component.CmtTextField value={name} onChange={(e) => setName(e.target.value)} label="Nom de l'élément" id={`noClickableLinksMenuEntry-name`} />

                <Box display="flex" justifyContent={'flex-end'}>
                    <Button variant="contained" disabled={!name} onClick={handleSubmitLink} id={`noClickableMenuEntrySubmit`}>
                        Ajouter
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};
