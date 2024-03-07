import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, FormControl, FormControlLabel, Grid, IconButton, Popover, Switch, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';

export const DisplayMenuElement = ({
    element,
    index,
    list,
    handleChange,
    handleBlur,
    setFieldValue,
    name = 'children',
    isSubMenu = false,
    parent = null,
    handleMoveOutSubMenuElement = null,
    maxLevel,
    isDragging = false,
    level = 1,
    menuEntryModule,
    language,
    errors,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const displayMove = index > 0 || index < list?.length - 1 || isSubMenu;

    const handleClickParams = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseParams = () => {
        setAnchorEl(null);
    };

    const handleMoveMenuElement = (move) => {
        let newList = list;
        let elem = element;

        newList.splice(index, 1);
        newList.splice(index + move, 0, elem);

        setFieldValue(name, newList);
    };

    const handleMoveIntoSubMenuElement = () => {
        let newList = [...list];
        let parent = { ...list[index - 1] };
        let newSubMenu = parent.children ? [...parent.children] : [];
        let elem = element;

        newList.splice(index, 1);

        newSubMenu.push(elem);
        parent.children = [...newSubMenu];
        newList[index - 1] = parent;

        setFieldValue(name, newList);
    };

    const moveOutSubMenuElement = (subMenuIndex) => {
        let newList = [...list];
        let parent = { ...list[index] };
        let children = [...parent.children];
        let elem = element.children[subMenuIndex];

        newList.splice(index + 1, 0, elem);

        children.splice(subMenuIndex, 1);
        parent.children = [...children];
        newList[index] = { ...parent };

        setFieldValue(name, newList);
    };

    const handleDeleteElement = () => {
        let newList = [...list];

        newList.splice(index, 1);

        setFieldValue(name, newList);
    };

    const EditValueComponent = menuEntryModule[element.menuType]?.MenuEntryModule || null;

    return (
        <Box sx={{ marginTop: 3 }}>
            <Accordion sx={{ maxWidth: 400 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} id="rooms-menus-elements-header">
                    <Typography>{element.name}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Component.CmtTextField value={element.name} name={`${name}.${index}.name`} onChange={handleChange} onBlur={handleBlur} label={'Titre de la navigation'} />
                    {EditValueComponent && (
                        <EditValueComponent
                            setValue={(newValue) => setFieldValue(`${name}.${index}.value`, newValue)}
                            element={element}
                            errors={errors}
                            language={language}
                            editMode
                        />
                    )}

                    {Boolean(anchorEl) && (
                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handleCloseParams}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'center',
                                horizontal: 'left',
                            }}
                            sx={{ ml: 3 }}
                        >
                            <Box minWidth={300} width={500} maxWidth={'90vw'} p={5}>
                                <Typography> {element.name} </Typography>

                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <Component.CmtSelect
                                            label="Ouvrir dans"
                                            id={`menu-${index}-target`}
                                            name={`${name}.${index}.target`}
                                            value={element.target}
                                            list={[
                                                { label: 'Ouvrir dans le même onglet', value: '_self' },
                                                { label: 'Ouvrir dans un nouvel onglet', value: '_blank' },
                                            ]}
                                            getValue={(item) => item.value}
                                            getName={(item) => item.label}
                                            setFieldValue={setFieldValue}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Component.CmtSelect
                                            label="Attribut follow"
                                            id={`menu-${index}-noFollow`}
                                            name={`${name}.${index}.noFollow`}
                                            value={element.noFollow}
                                            list={[
                                                { label: 'Follow', value: false },
                                                { label: 'No Follow', value: true },
                                            ]}
                                            getValue={(item) => item.value}
                                            getName={(item) => item.label}
                                            setFieldValue={setFieldValue}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ mt: 10 }}>
                                            <FormControlLabel
                                                size="small"
                                                id={`menu-${index}-active`}
                                                value={Boolean(element.active)}
                                                onChange={(e) => {
                                                    setFieldValue(`${name}.${index}.active`, e.target.checked);
                                                }}
                                                label={'Entrée de menu activée ?'}
                                                labelPlacement="start"
                                                control={<Switch checked={Boolean(element.active)} />}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    marginLeft: 0,
                                                    marginBlock: 0,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Popover>
                    )}

                    <Box display="flex" justifyContent="flex-end">
                        <Button size="small" variant="text" color="primary" onClick={(e) => handleClickParams(e)}>
                            <Typography fontSize={10} textTransform={'none'}>
                                Paramètres avancés {'>'}
                            </Typography>
                        </Button>
                    </Box>

                    <Box display="flex">
                        {displayMove && (
                            <Box component="span">
                                {index < list.length - 1 && (
                                    <Component.MoveElementButton onClick={() => handleMoveMenuElement(1)} size="small" title="Descendre d'un cran">
                                        <ArrowDownwardIcon fontSize="inherit" />
                                    </Component.MoveElementButton>
                                )}

                                {index > 0 && (
                                    <>
                                        <Component.MoveElementButton onClick={() => handleMoveMenuElement(-1)} size="small" title="Monter d'un cran">
                                            <ArrowUpwardIcon fontSize="inherit" />
                                        </Component.MoveElementButton>

                                        {level < maxLevel && (
                                            <Component.MoveElementButton onClick={() => handleMoveIntoSubMenuElement()} size="small" title={`Sous ${list[index - 1].name}`}>
                                                <SubdirectoryArrowRightIcon fontSize="inherit" />
                                            </Component.MoveElementButton>
                                        )}
                                    </>
                                )}

                                {isSubMenu && (
                                    <Component.MoveElementButton onClick={() => handleMoveOutSubMenuElement(index)} size="small" title={`Sortir de ${parent.name}`}>
                                        <SubdirectoryArrowLeftIcon fontSize="inherit" />
                                    </Component.MoveElementButton>
                                )}
                            </Box>
                        )}

                        <IconButton aria-label="delete" color="error" size="small" sx={{ marginLeft: 'auto' }} onClick={() => handleDeleteElement()}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Droppable droppableId={`${name}.${index}.children`} className={'droppableZone'} type={`menus`}>
                {(provided, snapshot) => (
                    <Component.DroppableBox
                        id={`${name}-${index}-children`}
                        sx={{
                            marginLeft: 10,
                            zIndex: 10,
                        }}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                        isDragging={isDragging}
                        className={'droppableMenus'}
                    >
                        {element?.children?.length > 0 &&
                            level < maxLevel &&
                            element?.children?.map((item, ind) => (
                                <Draggable key={`${name}.${index}.children.${ind}`} draggableId={`${name}.${index}.children.${ind}`} index={index} item={item}>
                                    {(provided2, snapshot2) => (
                                        <Component.RenderElement provided={provided2} snapshot={snapshot2}>
                                            <Component.DisplayMenuElement
                                                element={item}
                                                key={ind}
                                                index={ind}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                list={element?.children}
                                                setFieldValue={setFieldValue}
                                                name={`${name}.${index}.children`}
                                                isSubMenu={true}
                                                parent={element}
                                                handleMoveOutSubMenuElement={moveOutSubMenuElement}
                                                maxLevel={maxLevel}
                                                level={level + 1}
                                                isDragging={snapshot2.isDragging}
                                                menuEntryModule={menuEntryModule}
                                                language={language}
                                                errors={errors?.at(children)}
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
    );
};

export const RenderElement = ({ children, provided, snapshot }) => {
    const child = (
        <Component.DraggableBox {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} isDragging={snapshot.isDragging}>
            {children}
        </Component.DraggableBox>
    );

    return child;
};
