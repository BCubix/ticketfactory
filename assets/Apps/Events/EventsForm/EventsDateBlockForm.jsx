import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import React, { useState } from 'react';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { EventsDateForm } from './EventsDateForm';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { getNestedFormikError } from '../../../services/utils/getNestedFormikError';
import { CmtRemoveButton } from '../../../Components/CmtRemoveButton/CmtRemoveButton';

export const EventsDateBlockForm = ({
    values,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleChange,
    touched,
    errors,
}) => {
    const [deleteMultiple, setDeleteMultiple] = useState(false);

    const handleDeleteMultiple = () => {
        let block = values.eventDateBlocks;

        if (!block || block.length === 0) {
            block = { name: 'Dates', eventDates: [] };
        } else {
            block = block[0];
            block.name = 'Dates';
        }

        setFieldValue('eventDateBlocks', [block]);
        setFieldValue('multipleDateBlock', false);
    };

    return (
        <>
            <FieldArray name="eventDateBlocks">
                {({ remove, push }) => (
                    <Box>
                        <Box pt={2} pl={4} display="flex" justifyContent={'flex-end'}>
                            <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    if (values?.multipleDateBlock) {
                                        if (values?.eventDateBlocks?.length > 1) {
                                            setDeleteMultiple(true);
                                        } else {
                                            handleDeleteMultiple();
                                        }
                                    } else {
                                        push({ name: '', eventDates: [] });
                                        setFieldValue('multipleDateBlock', true);
                                    }
                                }}
                            >
                                <AddIcon />
                                <Typography mt={'2px'} component="p" variant="body1">
                                    {values?.multipleDateBlock
                                        ? 'Ne plus utiliser les groupes'
                                        : 'Utiliser les groupes'}
                                </Typography>
                            </Button>

                            {values?.multipleDateBlock && (
                                <Button
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        push({ name: '', eventPrices: [] });
                                    }}
                                    sx={{ ml: 2 }}
                                >
                                    <AddIcon />
                                    <Typography mt={'2px'} component="p" variant="body1">
                                        Ajouter un groupe
                                    </Typography>
                                </Button>
                            )}
                        </Box>
                        {values?.eventDateBlocks?.map((item, index) => (
                            <CmtFormBlock
                                title={values?.multipleDateBlock ? '' : item?.name}
                                key={index}
                            >
                                {values?.multipleDateBlock && (
                                    <Box mb={4}>
                                        <CmtTextField
                                            value={item.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            label="Nom"
                                            name={`eventDateBlocks.${index}.name`}
                                            error={getNestedFormikError(
                                                touched?.eventDateBlocks,
                                                errors?.eventDateBlocks,
                                                index,
                                                'name'
                                            )}
                                        />
                                    </Box>
                                )}
                                <EventsDateForm
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    touched={touched}
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    key={index}
                                    blockIndex={index}
                                />
                                {values.multipleDateBlock && (
                                    <CmtRemoveButton
                                        pt="2px"
                                        className="pointer"
                                        size="small"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                    >
                                        <CloseIcon />
                                    </CmtRemoveButton>
                                )}
                            </CmtFormBlock>
                        ))}
                    </Box>
                )}
            </FieldArray>
            <DeleteDialog
                open={deleteMultiple}
                onCancel={() => setDeleteMultiple(false)}
                onDelete={() => {
                    handleDeleteMultiple();
                    setDeleteMultiple(false);
                }}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">
                        Êtes-vous sûr de ne plus vouloir utiliser les groupes ?
                    </Typography>
                    <Typography component="p">
                        Attention, seul le premier groupe ne sera pas supprimé.
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
