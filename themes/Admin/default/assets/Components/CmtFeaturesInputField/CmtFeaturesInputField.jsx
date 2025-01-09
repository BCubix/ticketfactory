import React, { useCallback } from 'react';
import { FieldArray } from 'formik';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import { Component } from '@/AdminService/Component';
import { getPropByString } from '@Services/utils/getPropByString';
import { Box } from '@mui/system';
import { Grid, IconButton } from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export const CmtFeaturesInputField = ({ featuresList, values, setFieldValue, setFieldTouched, touched, errors, enableDraggable = false, ...props }) => {
    const valuesList = useCallback(
        (item) => {
            if (!item?.feature || featuresList?.length === 0) {
                return [];
            }

            const feature = featuresList?.find((el) => parseInt(el.id) === parseInt(item?.feature));
            if (!feature) {
                return [];
            }

            return feature?.featureValues;
        },
        [values]
    );

    const valuesType = useCallback(
        (item) => {
            if (!item?.feature || featuresList?.length === 0) {
                return '';
            }

            const feature = featuresList?.find((el) => parseInt(el.id) === parseInt(item?.feature));
            if (!feature) {
                return '';
            }

            return feature?.type;
        },
        [values]
    );

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        let draggableId = result.source.index;
        let destId = result.destination.index;

        let newList = values?.featureLinks || [];
        let removedElement = newList?.splice(draggableId, 1)[0];
        newList.splice(destId, 0, removedElement);

        newList.forEach((_, index) => {
            newList[index].index = index;
        });

        setFieldValue('featureLinks', newList);
    };

    return (
        <FieldArray name={'featureLinks'}>
            {({ remove, push }) => (
                <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
                    <Droppable droppableId="attribute" isCombineEnabled ignoreContainerClipping>
                        {(provided, snapshot) => (
                            <Component.FeatureDroppableBox
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                sx={{ width: '100%' }}
                                isDragging={(() => {
                                    if (snapshot.isDragging) {
                                        setExpendElementTranslation(null);
                                    }
                                    return snapshot.isDragging;
                                })()}
                            >
                                {values &&
                                    values?.featureLinks?.map((item, index) => (
                                        <Draggable key={`attribute.${index}`} draggableId={`attribute.${index}`} index={index} isCombineEnabled ignoreContainerClipping>
                                            {(provided2, snapshot2) => (
                                                <Box ref={provided2.innerRef} {...provided2.draggableProps} sx={{ width: '100%' }}>
                                                    <Component.CmtFormBlock key={index}>
                                                        <Box key={index}>
                                                            <Component.DeleteBlockFabButton
                                                                size="small"
                                                                onClick={() => {
                                                                    remove(index);
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </Component.DeleteBlockFabButton>
                                                            <Box className="flex align-center">
                                                                <Box
                                                                    height="100%"
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        height: 30,
                                                                        width: 30,
                                                                        marginTop: 6,
                                                                        marginRight: 3,
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    {...provided2.dragHandleProps}
                                                                >
                                                                    <DragHandleIcon sx={{ color: (theme) => theme.palette.crud.action.textColor }} />
                                                                </Box>
                                                                <Grid container spacing={4}>
                                                                    <Grid item xs={10} md={2} display="flex" alignItems="center">
                                                                        <Component.CmtSelectField
                                                                            label={'Attribut'}
                                                                            value={featuresList?.length > 0 ? item?.feature : ''}
                                                                            errors={
                                                                                getPropByString(touched, `featureLinks.${index}.feature`) &&
                                                                                getPropByString(errors, `featureLinks.${index}.feature`)
                                                                            }
                                                                            list={featuresList || []}
                                                                            name={`featureLinks.${index}.feature`}
                                                                            setFieldValue={(name, newValue) => {
                                                                                setFieldValue(name, newValue);
                                                                                setFieldValue(`featureLinks.${index}.featureValue`, '');
                                                                                setFieldValue(`featureLinks.${index}.featureValueRaw`, '');
                                                                            }}
                                                                            getName={(item) => item.name}
                                                                            getValue={(item) => item.id}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} md={5} display="flex" alignItems="center">
                                                                        <Component.CmtSelectField
                                                                            label={'Valeur'}
                                                                            value={item?.featureValue || ''}
                                                                            errors={
                                                                                getPropByString(touched, `featureLinks.${index}.featureValue`) &&
                                                                                getPropByString(errors, `featureLinks.${index}.featureValue`)
                                                                            }
                                                                            list={valuesList(item) || []}
                                                                            name={`featureLinks.${index}.featureValue`}
                                                                            setFieldValue={setFieldValue}
                                                                            setFieldTouched={setFieldTouched}
                                                                            getName={(item) => item.value}
                                                                            getValue={(item) => item.id}
                                                                            disabled={Boolean(!item?.feature || item?.featureValueRaw)}
                                                                            clearable
                                                                            required={!item?.featureValueRaw}
                                                                        />
                                                                        {item?.featureValue && (
                                                                            <IconButton
                                                                                sx={{ padding: 0, marginTop: 6 }}
                                                                                color="error"
                                                                                onClick={() => setFieldValue(`featureLinks.${index}.featureValue`, '')}
                                                                            >
                                                                                <HighlightOffIcon />
                                                                            </IconButton>
                                                                        )}
                                                                    </Grid>
                                                                    <Grid item xs={12} md={5} display="flex" alignItems="center">
                                                                        <Component.CmtFeaturesTypeValues
                                                                            baseName={`featureLinks.${index}.`}
                                                                            name={'featureValueRaw'}
                                                                            label={'Valeur personnalisée'}
                                                                            values={values}
                                                                            setFieldValue={setFieldValue}
                                                                            {...props}
                                                                            type={valuesType(item)}
                                                                            featuresList={featuresList}
                                                                            touched={touched}
                                                                            errors={errors}
                                                                            disabled={Boolean(!item?.feature || item?.featureValue)}
                                                                            required={!item?.featureValue}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </Box>
                                                    </Component.CmtFormBlock>
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </Component.FeatureDroppableBox>
                        )}
                    </Droppable>
                    <Component.CmtEndPositionWrapper>
                        <Component.AddBlockButton
                            size="small"
                            id="addField"
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                push({ feature: '', featureValue: '', featureValueRaw: '' });
                            }}
                        >
                            <AddIcon /> Ajouter un attribut
                        </Component.AddBlockButton>
                    </Component.CmtEndPositionWrapper>
                </DragDropContext>
            )}
        </FieldArray>
    );
};
