import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { useState } from 'react';
import { Box } from '@mui/system';
import { CmtTextField } from '../../Components/CmtTextField/CmtTextField';

const MENU_TYPE = 'externalLink';
const MENU_TYPE_LABEL = 'Liens externe';

export const MenuEntryModule = ({ addElementToMenu }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="rooms-menus-elements-header">
                <Typography>Liens externe</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <CmtTextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Nom de l'élément"
                    required
                />

                <CmtTextField
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    label="Lien"
                    required
                />

                <Box display="flex" justifyContent={'flex-end'}>
                    <Button
                        variant="contained"
                        disabled={!name || !value}
                        onClick={() => {
                            addElementToMenu([
                                {
                                    name: name,
                                    value: value,
                                    menuType: MENU_TYPE,
                                    children: [],
                                },
                            ]);
                        }}
                    >
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
