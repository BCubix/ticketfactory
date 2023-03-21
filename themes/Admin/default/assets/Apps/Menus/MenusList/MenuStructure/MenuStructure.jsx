import React, { useMemo } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import { formatMenusData } from '@Services/utils/formatMenusData';
import getMenuEntryModules from '../getMenuEntryModules';

export const MenuStructure = ({ values, setFieldValue, handleChange, handleBlur, touched, errors, languageList, openTranslateDialog, language }) => {
    const menuEntryModule = useMemo(() => {
        const modules = getMenuEntryModules();
        return modules;
    }, []);

    const removeMenuElement = (menus, path) => {
        if (path.length === 0) {
            return menus;
        }

        if (path.length === 1) {
            let pathElem = path.shift();
            const key = parseInt(pathElem) || pathElem;

            return menus.splice(key, 1)[0];
        }

        const pathElem = path.shift();
        const key = parseInt(pathElem) || pathElem;

        return removeMenuElement(menus[key], path);
    };

    const insertMenuElement = (menus, path, value, index) => {
        if (path.length === 0) {
            menus.splice(index, 0, value);
            return;
        }

        const pathElem = path.shift();
        const key = parseInt(pathElem) || pathElem;

        insertMenuElement(menus[key], path, value, index);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        let element = formatMenusData(values.children);
        let draggableId = result.draggableId.split('.');
        draggableId.shift();

        const removedElement = removeMenuElement(element, draggableId);
        let destinationId = result.destination.droppableId.split('.');
        destinationId.shift();

        insertMenuElement(element, destinationId, removedElement, result.destination.index);
        setFieldValue('children', element);
    };

    return (
        <>
            <Box display="flex" justifyContent={'space-between'} alignItems="center">
                <Typography component="h2" variant="h4">
                    Structure du menu
                </Typography>

                {languageList?.length > 0 && (
                    <Component.ActionButton variant="contained" size="small" color="action" onClick={openTranslateDialog}>
                        Traduire
                    </Component.ActionButton>
                )}
            </Box>

            <Component.CmtTextField value={values.name} onChange={handleChange} onBlur={handleBlur} label={'Nom du menu'} name={'name'} error={touched.name && errors.name} />

            <Box sx={{ marginTop: 3 }}>
                <Box id={'menus-portal'} />
                <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
                    <Box>
                        <Droppable droppableId="menus" type="menus" isCombineEnabled ignoreContainerClipping>
                            {(provided, snapshot) => (
                                <Component.DroppableBox
                                    id="menus"
                                    className="droppableMenus"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    sx={{
                                        paddingTop: 0,
                                        paddingBottom: 10,
                                        margin: 0,
                                        paddingInline: 0,
                                    }}
                                    isDraggingOver={snapshot.isDraggingOver}
                                >
                                    {values?.children?.map((item, index) => (
                                        <Draggable key={`children.${index}`} draggableId={`children.${index}`} index={index}>
                                            {(provided2, snapshot2) => (
                                                <Component.RenderElement provided={provided2} snapshot={snapshot2}>
                                                    <Component.DisplayMenuElement
                                                        element={item}
                                                        key={index}
                                                        index={index}
                                                        handleChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        list={values.children}
                                                        setFieldValue={setFieldValue}
                                                        isDragging={snapshot2.isDragging}
                                                        maxLevel={values.maxLevel}
                                                        menuEntryModule={menuEntryModule}
                                                        language={language}
                                                        errors={errors?.children?.at(index) || null}
                                                    />
                                                </Component.RenderElement>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Component.DroppableBox>
                            )}
                        </Droppable>
                    </Box>
                </DragDropContext>
            </Box>
        </>
    );
};
