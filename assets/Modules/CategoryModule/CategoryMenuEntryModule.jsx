import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect } from 'react';
import { useState } from 'react';
import authApi from '../../services/api/authApi';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { REDIRECTION_TIME } from '../../Constant';
import { Box } from '@mui/system';
import { loginFailure } from '../../redux/profile/profileSlice';
import seasonsApi from '../../services/api/seasonsApi';
import categoriesApi from '../../services/api/categoriesApi';

const MENU_TYPE = 'category';
const MENU_TYPE_LABEL = 'Catégories';

const DisplayCategories = ({ category, selectedAdd, setSelectedAdd }) => {
    return (
        <>
            <Box
                onClick={() => {
                    let newValue = [...selectedAdd];

                    if (newValue?.some((el) => el.id === category.id)) {
                        newValue = newValue.filter((el) => el.id !== category.id);
                    } else {
                        newValue.push({ id: category.id, name: category.name });
                    }

                    setSelectedAdd([...newValue]);
                }}
            >
                <Typography component="span">
                    <Checkbox checked={selectedAdd?.some((el) => el.id === category.id)} />
                    {category?.name}
                </Typography>
            </Box>

            {Array.isArray(category?.children) &&
                category?.children?.map((item, index) => (
                    <DisplayCategories
                        key={index}
                        category={item}
                        selectedAdd={selectedAdd}
                        setSelectedAdd={setSelectedAdd}
                    />
                ))}
        </>
    );
};

export const MenuEntryModule = ({ addElementToMenu }) => {
    const dispatch = useDispatch();
    const [selectedAdd, setSelectedAdd] = useState([]);
    const [list, setList] = useState(null);

    const getList = async () => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await categoriesApi.getCategories();

        if (!result?.result) {
            NotificationManager.error(
                'Une erreur est survenue, essayez de rafraichir la page.',
                'Erreur',
                REDIRECTION_TIME
            );
        }

        setList(result.categories);
    };

    useEffect(() => {
        getList();
    }, []);

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="rooms-menus-elements-header">
                <Typography>Catégories</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <DisplayCategories
                    category={list}
                    selectedAdd={selectedAdd}
                    setSelectedAdd={setSelectedAdd}
                />

                <Box display="flex" justifyContent={'flex-end'}>
                    <Button
                        variant="contained"
                        disabled={selectedAdd.length === 0}
                        onClick={() => {
                            let submitList = [];

                            selectedAdd.forEach((el) => {
                                submitList.push({
                                    name: el.name,
                                    value: el.id,
                                    menuType: MENU_TYPE,
                                    children: [],
                                });
                            });

                            addElementToMenu(submitList);
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
