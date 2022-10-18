import { FormHelperText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import React, { useState } from 'react';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { EventsDateForm } from './EventsDateForm';
import AddIcon from '@mui/icons-material/Add';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { getNestedFormikError } from '../../../services/utils/getNestedFormikError';
import {
    ActionButton,
    CreateButton,
    DeleteBlockFabButton,
} from '../../../Components/CmtButton/sc.Buttons';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { EventDateRange } from './EventDateRange';
import moment from 'moment';

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
    const [generateDate, setGenerateDate] = useState(null);

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

    const getBlockError = (index) => {
        const err = getNestedFormikError(
            touched?.eventDateBlocks,
            errors?.eventDateBlocks,
            index,
            'eventDates'
        );

        if (typeof err === 'string') {
            return err;
        }

        return '';
    };

    return (
        <>
            <FieldArray name="eventDateBlocks">
                {({ remove, push }) => (
                    <Box>
                        <Box pt={2} pl={4} display="flex" justifyContent={'flex-end'}>
                            <ActionButton
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
                                <WorkspacesIcon sx={{ marginRight: 1 }} />
                                {values?.multipleDateBlock
                                    ? 'Ne plus utiliser les groupes'
                                    : 'Utiliser les groupes'}
                            </ActionButton>

                            {values?.multipleDateBlock && (
                                <CreateButton
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        push({ name: '', eventDates: [] });
                                    }}
                                    sx={{ ml: 2 }}
                                >
                                    <AddIcon sx={{ marginRight: 1 }} />
                                    Ajouter un groupe
                                </CreateButton>
                            )}
                        </Box>
                        {values?.eventDateBlocks?.map((item, index) => (
                            <CmtFormBlock
                                marginBlock={7}
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
                                    setGenerateDate={setGenerateDate}
                                />

                                <FormHelperText error>{getBlockError(index)}</FormHelperText>

                                {values.multipleDateBlock && (
                                    <DeleteBlockFabButton
                                        size="small"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </DeleteBlockFabButton>
                                )}
                            </CmtFormBlock>
                        ))}
                    </Box>
                )}
            </FieldArray>
            <EventDateRange
                open={generateDate}
                setOpen={setGenerateDate}
                submitDateRange={(newDates) => {
                    let dates = values.eventDateBlocks[generateDate]?.eventDates;
                    dates = [...dates, ...newDates];

                    dates.sort((a, b) => moment(a.eventDate).diff(b.eventDate));

                    setFieldValue(`eventDateBlocks.${generateDate}.eventDates`, [...dates]);
                }}
            />
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
