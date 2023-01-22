import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

const MENU_TYPE = 'event';
const MENU_TYPE_LABEL = 'Evènements';

export const MenuEntryModule = ({ addElementToMenu, language }) => {
    const dispatch = useDispatch();
    const [selectedAdd, setSelectedAdd] = useState([]);
    const [list, setList] = useState(null);

    const getList = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.eventsApi.getEvents({ lang: language?.id });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }
            setList(result.events);
        });
    };

    useEffect(() => {
        getList();
    }, [language]);

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="events-menus-elements-header">
                <Typography>Evènements</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {list?.map((item, index) => (
                    <Box
                        key={index}
                        onClick={() => {
                            let newValue = [...selectedAdd];

                            if (newValue?.includes(item.id)) {
                                newValue = newValue.filter((el) => el !== item.id);
                            } else {
                                newValue.push(item.id);
                            }

                            setSelectedAdd([...newValue]);
                        }}
                    >
                        <Typography component="span" id={`eventsMenuEntryValue-${item.id}`}>
                            <Checkbox checked={selectedAdd?.includes(item.id)} />
                            {item?.name}
                        </Typography>
                    </Box>
                ))}

                <Box display="flex" justifyContent={'flex-end'}>
                    <Button
                        variant="contained"
                        disabled={selectedAdd.length === 0}
                        onClick={() => {
                            let submitList = [];

                            selectedAdd.forEach((el) => {
                                let listElement = list.find((element) => element.id === el);

                                if (listElement) {
                                    submitList.push({
                                        name: listElement.name,
                                        value: listElement.id,
                                        menuType: MENU_TYPE,
                                        children: [],
                                    });
                                }
                            });

                            addElementToMenu(submitList);
                            setSelectedAdd([]);
                        }}
                        id="eventsMenuEntrySubmit"
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
