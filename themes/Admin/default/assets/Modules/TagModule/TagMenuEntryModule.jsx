import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { useSelector } from 'react-redux';
import { menusListDataSelector, setMenusListData } from '@Redux/menus/menusListDataSlice';

const MENU_TYPE = 'tag';
const MENU_TYPE_LABEL = 'Tags';

export const MenuEntryModule = ({ addElementToMenu, language, editMode, setValue, element, errors }) => {
    const dispatch = useDispatch();
    const [selectedAdd, setSelectedAdd] = useState([]);
    const [list, setList] = useState(null);
    const { menusListData } = useSelector(menusListDataSelector);

    const getList = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.tagsApi.getTags({ lang: language?.id });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            dispatch(setMenusListData({ tags: result.tags }));
        });
    };

    useEffect(() => {
        if (menusListData?.tags && !list) {
            setList(menusListData.tags);
            return;
        }

        if (editMode) {
            return;
        }

        getList();
    }, [language]);

    useEffect(() => {
        setList(menusListData.tags);
    }, [menusListData?.tags]);

    if (editMode) {
        return list ? (
            <Component.CmtSelect
                label="Tag"
                required
                name={`tag`}
                value={parseInt(element.value)}
                list={list || []}
                getValue={(item) => item.id}
                getName={(item) => `${item.name}`}
                setFieldValue={(_, newValue) => setValue(newValue)}
                errors={errors?.value}
            />
        ) : (
            <></>
        );
    }

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
    MENU_TYPE,
};
