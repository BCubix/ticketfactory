import React from 'react';
import { FieldArray } from 'formik';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { Box } from '@mui/system';
import { Grid, IconButton } from '@mui/material';

import { Component } from '@/AdminService/Component';

import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const PageBlockColumnElem = ({ column, index, values, media, setFieldValue, setFieldTouched, remove, baseName, errors, touched }) => {
    return (
        <Draggable key={`columns.${index}`} draggableId={`columns.${index}`} index={index}>
            {(provided, snapshot) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2} sx={{ display: 'flex', overflowX: 'hidden' }} ref={provided.innerRef} {...provided.draggableProps}>
                    <Component.CmtCard sx={{ border: '1px solid #C4C4C4', overflowX: 'hidden', width: '100%', minWidth: 0 }}>
                        <Box display="flex" justifyContent="space-between" flexWrap="wrap" padding={3}>
                            <IconButton
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 30,
                                    width: 30,
                                    minHeight: 0,
                                    cursor: 'drag',
                                }}
                                {...provided.dragHandleProps}
                            >
                                <DragIndicatorOutlinedIcon sx={{ color: (theme) => theme.palette.crud.action.textColor }} />
                            </IconButton>
                            <Component.DeleteFabButton
                                size="small"
                                id={`${baseName.replaceAll('.', '-')}-columns-${index}-remove`}
                                sx={{ height: 30, width: 30, minHeight: 0, minWidth: 0 }}
                                onClick={() => {
                                    remove(index);
                                }}
                            >
                                <DeleteIcon />
                            </Component.DeleteFabButton>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBlock: 2 }}>
                            <Component.CmtImage
                                id={`sliderElem-${index}`}
                                name={`${baseName}columns.${index}.content`}
                                image={values?.columns?.at(index)?.content}
                                setFieldValue={setFieldValue}
                                touched={touched?.content}
                                errors={errors?.content}
                                width="80%"
                            />
                        </Box>
                    </Component.CmtCard>
                </Grid>
            )}
        </Draggable>
    );
};

export const PagesBlocksSliderPart = ({ values, setFieldValue, setFieldTouched, baseName, errors, touched }) => {
    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        let draggableId = result.source.index;
        let destId = result.destination.index;

        const tmp = values.columns[destId];
        setFieldValue(`${baseName}columns.${destId}`, values.columns[draggableId]);
        setFieldValue(`${baseName}columns.${draggableId}`, tmp);
    };

    return (
        <FieldArray name={`${baseName}columns`}>
            {({ remove, push }) => (
                <>
                    <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
                        <Droppable direction="horizontal" droppableId="columns" type="columns" isCombineEnabled ignoreContainerClipping>
                            {(provided, snapshot) => (
                                <Grid container {...provided.droppableProps} ref={provided.innerRef} sx={{ paddingLeft: 10 }} spacing={4}>
                                    {values?.columns?.map((column, index) => (
                                        <PageBlockColumnElem
                                            index={index}
                                            column={column}
                                            key={index}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            setFieldTouched={setFieldTouched}
                                            remove={remove}
                                            baseName={baseName}
                                            errors={errors?.columns?.at(index)}
                                            touched={touched?.columns?.at(index)}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </Grid>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <Component.CmtEndPositionWrapper>
                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            id="addContentButton"
                            onClick={() => {
                                push({
                                    content: null,
                                    xs: 12,
                                    s: 12,
                                    m: 12,
                                    l: 12,
                                    xl: 12,
                                });
                            }}
                            sx={{ marginTop: 3 }}
                        >
                            <AddIcon /> Ajouter un élément
                        </Component.AddBlockButton>
                    </Component.CmtEndPositionWrapper>
                </>
            )}
        </FieldArray>
    );
};
