import React, { useEffect, useState } from 'react';
import { Grid, IconButton, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import { Component } from '@/AdminService/Component';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import { Box } from '@mui/system';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const PageBlockColumnElem = ({ column, index, values, media, setFieldValue, setFieldTouched, remove, baseName }) => {
    const [size, setSize] = useState(column[media]);

    useEffect(() => {
        setSize(column[media]);
    }, [media, column]);

    return (
        <Draggable key={`columns.${index}`} draggableId={`columns.${index}`} index={index}>
            {(provided, snapshot) => (
                <Grid
                    item
                    key={index}
                    xs={column[media]}
                    sx={{ minHeight: 150, marginTop: 4, marginLeft: 0, marginRight: -12, paddingRight: 12 }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    isDragging={snapshot.isDragging}
                >
                    <Component.CmtCard sx={{ border: '1px solid #C4C4C4', overflowX: 'hidden' }}>
                        <Box display="flex" justifyContent="space-between" flexWrap="wrap" padding={3}>
                            <IconButton
                                height="100%"
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
                            <Box display="flex" alignItems={'center'} position="relative">
                                <Typography component="span" variant="h5">
                                    Taille :
                                </Typography>
                                <Component.CmtTextField
                                    fullWidth={false}
                                    size="small"
                                    value={size}
                                    className="numberTypeField-noArrow"
                                    sx={{
                                        marginInline: 3,
                                        width: 30,
                                        marginBlock: 0,
                                        '& input': {
                                            padding: 0,
                                            fontSize: 14,
                                        },
                                    }}
                                    onChange={(e) => {
                                        let newValue = e.target.value;

                                        if (!/^[0-9]*$/.test(newValue)) {
                                            return;
                                        }

                                        setSize(newValue);
                                    }}
                                    onBlur={() => {
                                        let newValue = size;

                                        if (newValue < 1) {
                                            newValue = 1;
                                            setSize(newValue);
                                        } else if (newValue > 12) {
                                            newValue = 12;
                                            setSize(newValue);
                                        }

                                        setFieldValue(`${baseName}columns.${index}.${media}`, newValue);
                                        setFieldTouched(`${baseName}columns.${index}.${media}`, true, false);
                                    }}
                                    name={`${baseName}columns.${index}.${media}`}
                                />
                                <Typography component="span" variant="h5">
                                    / 12
                                </Typography>
                            </Box>

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
                        <Component.LightEditorFormControl className="pageBlockEditor">
                            <Component.LightEditor
                                labelId={`${baseName}columns-${index}-content-label`}
                                value={values?.columns?.at(index)?.content}
                                onBlur={() => setFieldTouched(`${baseName}columns.${index}.content`, true, false)}
                                onChange={(val) => {
                                    setFieldValue(`${baseName}columns.${index}.content`, val);
                                }}
                            />
                        </Component.LightEditorFormControl>
                    </Component.CmtCard>
                </Grid>
            )}
        </Draggable>
    );
};

const AddContentBox = ({ index, values, setFieldValue, baseName }) => {
    const [displayAdd, setDisplayAdd] = useState(null);

    return (
        <Box
            onMouseEnter={() => setDisplayAdd(index)}
            onMouseLeave={() => setDisplayAdd(null)}
            display="flex"
            flexDirection={'column'}
            justifyContent="center"
            alignItems={'center'}
            width={30}
            sx={{ cursor: 'pointer', transition: '.3s', marginTop: 4 }}
            onClick={() => {
                let newColumns = values.columns;

                newColumns.splice(index + 1, 0, {
                    content: '',
                    xs: 12,
                    s: 12,
                    m: 12,
                    l: 12,
                    xl: 12,
                });

                setFieldValue(`${baseName}columns`, newColumns);
            }}
        >
            {displayAdd === index && (
                <>
                    <Box width={'1px'} backgroundColor="#C3C3C3" display="flex" flexGrow={1} />
                    <AddCircleOutlinedIcon sx={{ marginBlock: 2, height: 20, width: 20, minHeight: 0, minWidth: 0, color: (theme) => theme.palette.crud.create.textColor }} />
                    <Box width={'1px'} backgroundColor="#C3C3C3" display="flex" flexGrow={1} />
                </>
            )}
        </Box>
    );
};

export const PageBlockColumnPart = ({ values, media, setFieldValue, setFieldTouched, baseName = '' }) => {
    const [count, setCount] = useState(0);

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        let draggableId = result.source.index;
        let destId = result.destination.index;
        <div className=""></div>;

        const tmp = values.columns[destId];
        console.log(result);
        setFieldValue(`${baseName}columns.${destId}`, values.columns[draggableId]);
        setFieldValue(`${baseName}columns.${draggableId}`, tmp);
    };

    return (
        <FieldArray name={`${baseName}columns`}>
            {({ remove, push }) => (
                <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
                    <Droppable direction="horizontal" droppableId="columns" type="columns" isCombineEnabled ignoreContainerClipping>
                        {(provided, snapshot) => (
                            <Grid container {...provided.droppableProps} ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver} sx={{ minWidth: 1300 }}>
                                <AddContentBox index={-1} values={values} setFieldValue={setFieldValue} baseName={baseName} />
                                {values?.columns?.map((column, index) => (
                                    <>
                                        <PageBlockColumnElem
                                            media={media}
                                            index={index}
                                            column={column}
                                            key={index}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            setFieldTouched={setFieldTouched}
                                            remove={remove}
                                            baseName={baseName}
                                        />
                                        <AddContentBox index={index} values={values} setFieldValue={setFieldValue} baseName={baseName} />
                                        {/* <AddContentBoxSup count={count} setCount={setCount} size={column[media]}>
                                            <AddContentBox index={index} values={values} setFieldValue={setFieldValue} baseName={baseName} />
                                        </AddContentBoxSup> */}
                                    </>
                                ))}
                                {provided.placeholder}
                            </Grid>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </FieldArray>
    );
};

const AddContentBoxSup = ({ count, setCount, size, children }) => {
    if (count + size >= 12) {
        setCount(size % 12);
        return children;
    }

    setCount(count + size);

    return <></>;
};
