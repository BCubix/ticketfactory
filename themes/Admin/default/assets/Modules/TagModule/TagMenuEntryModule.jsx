import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';

import { loginFailure } from '@Redux/profile/profileSlice';

const MENU_TYPE = 'tag';
const MENU_TYPE_LABEL = 'Tags';

export const MenuEntryModule = ({ addElementToMenu }) => {
    const dispatch = useDispatch();
    const [selectedAdd, setSelectedAdd] = useState([]);
    const [list, setList] = useState(null);

    const getList = async () => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.tagsApi.getTags();

        if (!result?.result) {
            NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
        }

        setList(result.tags);
    };

    useEffect(() => {
        getList();
    }, []);

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="tags-menus-elements-header">
                <Typography>Tags</Typography>
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
                        <Typography component="span" id={`tagsMenuEntryValue-${item.id}`}>
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
                        id="tagsMenuEntrySubmit"
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
