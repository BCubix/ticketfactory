import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Radio, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { useSelector } from 'react-redux';
import { menusListDataSelector, setMenusListData } from '@Redux/menus/menusListDataSlice';
import { TreeItem, TreeView } from '@mui/lab';

const MENU_TYPE = 'category';
const MENU_TYPE_LABEL = 'Catégories';

const displayCategories = (list, selectedAdd, setSelectedAdd, editMode, setValue, value) => {
    if (!list || list?.length === 0) {
        return <></>;
    }

    const handleCheckCategory = (id) => {
        let categories = [...selectedAdd];
        const check = categories?.includes(id);

        if (check) {
            categories = categories?.filter((el) => el !== id);
            setSelectedAdd(categories);
        } else {
            categories.push(id);

            setSelectedAdd(categories);
        }
    };

    return (
        <TreeItem
            key={list.id}
            nodeId={list?.id?.toString()}
            label={
                <Box display="flex" alignItems={'center'}>
                    {editMode ? (
                        <Radio
                            checked={value?.toString() === list.id?.toString()}
                            onClick={(e) => {
                                e.stopPropagation();
                                setValue(list.id);
                            }}
                        />
                    ) : (
                        <Checkbox
                            checked={selectedAdd.includes(list.id)}
                            id={`eventCategoriesValue-${list.id}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCheckCategory(list.id);
                            }}
                        />
                    )}
                    {list?.name}
                </Box>
            }
        >
            {Array.isArray(list?.children) && list?.children?.map((item) => displayCategories(item, selectedAdd, setSelectedAdd, editMode, setValue, value))}
        </TreeItem>
    );
};

export const MenuEntryModule = ({ addElementToMenu, language, editMode, setValue, element }) => {
    const dispatch = useDispatch();
    const [selectedAdd, setSelectedAdd] = useState([]);
    const [list, setList] = useState(null);
    const { menusListData } = useSelector(menusListDataSelector);

    const getList = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.categoriesApi.getCategories({ lang: language?.id });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setList(result.categories);
            dispatch(setMenusListData({ categories: result.categories }));
        });
    };

    useEffect(() => {
        if (list) {
            return;
        }

        if (menusListData?.categories && !list) {
            setList(menusListData.categories);
            return;
        }

        if (editMode) {
            return;
        }

        getList();
    }, [language]);

    useEffect(() => {
        if (menusListData?.categories && !list) {
            setList(menusListData.categories);
        }
    }, [menusListData?.categories]);

    if (editMode) {
        return (
            <Box sx={{ marginTop: 3 }}>
                {list && (
                    <TreeView
                        size="small"
                        id="categories"
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={[list?.id?.toString()]}
                        defaultExpandIcon={<ChevronRightIcon />}
                        sx={{ flexGrow: 1, overflowY: 'auto' }}
                    >
                        {displayCategories(list, selectedAdd, setSelectedAdd, editMode, setValue, element?.value || '')}
                    </TreeView>
                )}
            </Box>
        );
    }

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="categories-menus-elements-header">
                <Typography>Catégories</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {list && (
                    <TreeView
                        size="small"
                        id="categories"
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={[list?.id?.toString()]}
                        defaultExpandIcon={<ChevronRightIcon />}
                        sx={{ flexGrow: 1, overflowY: 'auto' }}
                    >
                        {displayCategories(list, selectedAdd, setSelectedAdd, editMode, setValue, element?.value || '')}
                    </TreeView>
                )}

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
                            setSelectedAdd([]);
                        }}
                        id="categoriesMenuEntrySubmit"
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
