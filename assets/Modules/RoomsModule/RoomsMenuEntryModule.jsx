import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect } from 'react';
import { useState } from 'react';
import authApi from '../../services/api/authApi';
import { useDispatch } from 'react-redux';
import roomsApi from '../../services/api/roomsApi';
import { NotificationManager } from 'react-notifications';
import { REDIRECTION_TIME } from '../../Constant';
import { Box } from '@mui/system';

export const MenuEntryModule = () => {
    const dispatch = useDispatch();
    const [selectedAdd, setSelectedAdd] = useState([]);
    const [list, setList] = useState(null);

    const getRooms = async () => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await roomsApi.getRooms();

        if (!result?.result) {
            NotificationManager.error(
                'Une erreur est survenue, essayez de rafraichir la page.',
                'Erreur',
                REDIRECTION_TIME
            );
        }

        setList(result.rooms);
    };

    useEffect(() => {
        getRooms();
    }, []);

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Salles</Typography>
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

                            console.log(newValue);
                            setSelectedAdd([...newValue]);
                        }}
                    >
                        <Typography component="span">
                            <Checkbox checked={selectedAdd?.includes(item.id)} />
                            {item?.name}
                        </Typography>
                    </Box>
                ))}
            </AccordionDetails>
        </Accordion>
    );
};

export default {
    MenuEntryModule,
};
