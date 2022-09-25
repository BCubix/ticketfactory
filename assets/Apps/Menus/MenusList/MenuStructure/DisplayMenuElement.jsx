import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    IconButton,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import { MoveElementButton } from './sc.MoveElementButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { DroppableBox } from './sc.DroppableBox';

export const DisplayMenuElement = ({
    element,
    index,
    list,
    handleChange,
    handleBlur,
    setFieldValue,
    name = 'menus',
    isSubMenu = false,
    parent = null,
    handleMoveOutSubMenuElement = null,
    maxLevel,
    level = 1,
}) => {
    const displayMove = index > 0 || index < list?.length - 1 || isSubMenu;

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
        let newSubMenu = parent.subMenu ? [...parent.subMenu] : [];
        let elem = element;

        newList.splice(index, 1);

        newSubMenu.push(elem);
        parent.subMenu = [...newSubMenu];
        newList[index - 1] = parent;

        setFieldValue(name, newList);
    };

    const moveOutSubMenuElement = (subMenuIndex) => {
        let newList = [...list];
        let parent = { ...list[index] };
        let subMenu = [...parent.subMenu];
        let elem = element.subMenu[subMenuIndex];

        newList.splice(index + 1, 0, elem);

        subMenu.splice(subMenuIndex, 1);
        parent.subMenu = [...subMenu];
        newList[index] = { ...parent };

        setFieldValue(name, newList);
    };

    const handleDeleteElement = () => {
        let newList = [...list];

        newList.splice(index, 1);

        setFieldValue(name, newList);
    };

    return (
        <Box sx={{ marginTop: 3 }}>
            <Accordion sx={{ maxWidth: 400 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} id="rooms-menus-elements-header">
                    <Typography>{element.name}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <CmtTextField
                        value={element.name}
                        name={`${name}.${index}.name`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={'Titre de la navigation'}
                    />

                    <Box display="flex">
                        {displayMove && (
                            <Box component="span">
                                {index < list.length - 1 && (
                                    <MoveElementButton
                                        onClick={() => handleMoveMenuElement(1)}
                                        size="small"
                                        title="Descendre d'un cran"
                                    >
                                        <ArrowDownwardIcon fontSize="inherit" />
                                    </MoveElementButton>
                                )}

                                {index > 0 && (
                                    <>
                                        <MoveElementButton
                                            onClick={() => handleMoveMenuElement(-1)}
                                            size="small"
                                            title="Monter d'un cran"
                                        >
                                            <ArrowUpwardIcon fontSize="inherit" />
                                        </MoveElementButton>

                                        {level < maxLevel && (
                                            <MoveElementButton
                                                onClick={() => handleMoveIntoSubMenuElement()}
                                                size="small"
                                                title={`Sous ${list[index - 1].name}`}
                                            >
                                                <SubdirectoryArrowRightIcon fontSize="inherit" />
                                            </MoveElementButton>
                                        )}
                                    </>
                                )}

                                {isSubMenu && (
                                    <MoveElementButton
                                        onClick={() => handleMoveOutSubMenuElement(index)}
                                        size="small"
                                        title={`Sortir de ${parent.name}`}
                                    >
                                        <SubdirectoryArrowLeftIcon fontSize="inherit" />
                                    </MoveElementButton>
                                )}
                            </Box>
                        )}

                        <IconButton
                            aria-label="delete"
                            color="error"
                            size="small"
                            sx={{ marginLeft: 'auto' }}
                            onClick={() => handleDeleteElement()}
                        >
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Droppable
                droppableId={`${name}.${index}.subMenu`}
                className={'droppableZone'}
                type={`menus`}
            >
                {(provided, snapshot) => (
                    <DroppableBox
                        id={`${name}-${index}-subMenu`}
                        sx={{
                            marginLeft: 10,
                            zIndex: 10,
                        }}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                        className={'droppableMenus'}
                    >
                        {element?.subMenu?.length > 0 &&
                            level < maxLevel &&
                            element?.subMenu?.map((item, ind) => (
                                <Draggable
                                    key={`${name}.${index}.subMenu.${ind}`}
                                    draggableId={`${name}.${index}.subMenu.${ind}`}
                                    index={index}
                                    item={item}
                                >
                                    {(provided2) => (
                                        <Box
                                            {...provided2.draggableProps}
                                            {...provided2.dragHandleProps}
                                            ref={provided2.innerRef}
                                        >
                                            <DisplayMenuElement
                                                element={item}
                                                key={ind}
                                                index={ind}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                list={element?.subMenu}
                                                setFieldValue={setFieldValue}
                                                name={`${name}.${index}.subMenu`}
                                                isSubMenu={true}
                                                parent={element}
                                                handleMoveOutSubMenuElement={moveOutSubMenuElement}
                                                maxLevel={maxLevel}
                                                level={level + 1}
                                            />
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                        {provided.placeholder}
                    </DroppableBox>
                )}
            </Droppable>
        </Box>
    );
};
