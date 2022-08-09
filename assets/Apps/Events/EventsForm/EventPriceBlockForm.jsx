import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import React, { useState } from 'react';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { EventsPriceForm } from './EventsPriceForm';
import AddIcon from '@mui/icons-material/Add';
import { getNestedFormikError } from '../../../services/utils/getNestedFormikError';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { CmtRemoveButton } from '../../../Components/CmtRemoveButton/CmtRemoveButton';
import CloseIcon from '@mui/icons-material/Close';

export const EventsPriceBlockForm = ({
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
        let block = values.eventPriceBlocks;

        if (!block || block.length === 0) {
            block = { name: 'Tarifs', eventPrices: [] };
        } else {
            block = block[0];
            block.name = 'Tarifs';
        }

        setFieldValue('eventPriceBlocks', [block]);
        setFieldValue('multiplePriceBlock', false);
    };

    return (
        <>
            <FieldArray name="eventPriceBlocks">
                {({ remove, push }) => (
                    <Box>
                        <Box pt={2} pl={4} display="flex" justifyContent={'flex-end'}>
                            <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    if (values?.multiplePriceBlock) {
                                        if (values?.eventPriceBlocks?.length > 1) {
                                            setDeleteMultiple(true);
                                        } else {
                                            handleDeleteMultiple();
                                        }
                                    } else {
                                        push({ name: '', eventPrices: [] });
                                        setFieldValue('multiplePriceBlock', true);
                                    }
                                }}
                            >
                                <AddIcon />
                                <Typography mt={'2px'} component="p" variant="body1">
                                    {values?.multiplePriceBlock
                                        ? 'Ne plus utiliser les groupes'
                                        : 'Utiliser les groupes'}
                                </Typography>
                            </Button>

                            {values?.multiplePriceBlock && (
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
                        {values?.eventPriceBlocks?.map((item, index) => (
                            <CmtFormBlock
                                title={values?.multiplePriceBlock ? '' : item?.name}
                                key={index}
                            >
                                {values?.multiplePriceBlock && (
                                    <Box mb={4}>
                                        <CmtTextField
                                            value={item.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            label="Nom"
                                            name={`eventPriceBlocks.${index}.name`}
                                            error={getNestedFormikError(
                                                touched?.eventPriceBlocks,
                                                errors?.eventPriceBlocks,
                                                index,
                                                'name'
                                            )}
                                        />
                                    </Box>
                                )}
                                <EventsPriceForm
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    touched={
                                        touched?.eventPriceBlocks && touched.eventPriceBlocks[index]
                                    }
                                    errors={
                                        errors?.eventPriceBlocks && errors.eventPriceBlocks[index]
                                    }
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    blockIndex={index}
                                />

                                {values.multiplePriceBlock && (
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