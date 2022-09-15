import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';

export const MenuEntryModule = () => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Pages</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>Lorem ipsum</Typography>
            </AccordionDetails>
        </Accordion>
    );
};

export default {
    MenuEntryModule,
};
