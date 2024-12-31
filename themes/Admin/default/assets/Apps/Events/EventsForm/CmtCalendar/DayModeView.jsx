import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Paper, Typography, Table, TableBody, TableCell, Tooltip,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Component } from '@/AdminService/Component';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { StyledTableCell, StyledTableContainer, SlotDiv, DayModeStyledCell } from './sc.DayModeView';
import EventAddSpecialPricing from './../EventAddSpecialPricing';

const DayModeView = ({ values, columns, rows, options, setFieldValue, setGenerateDate, STATES, touched, errors, ...restProps }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogItemIndex, setDialogItemIndex] = useState(null);
  const [creatingItem, setCreatingItem] = useState(false);

  useEffect(() => {
    if (!creatingItem) handleCloseDialog();
  }, [creatingItem]);

  const handleCellClick = (rowIndex, dayIndex) => {
    const dayData = rows[rowIndex].days[dayIndex].data;
    const itemIndex = dayData?.[0]?.index ?? values.eventDate.length;

    if (!dayData || dayData.length === 0) {
      setCreatingItem(true);
      const currentCell = new Date(rows[rowIndex].days[dayIndex]?.date);
      currentCell.setHours(rowIndex);
      const formattedDate = format(currentCell, 'yyyy-MM-dd HH:mm:ss');
      setFieldValue(`eventDate.${itemIndex}`, {
        eventDate: formattedDate,
        annotation: '',
        state: 'valid',
        reportDate: '',
        index: itemIndex,
        eventDateUuid: uuidv4(),
      });
    }

    setDialogItemIndex(itemIndex);
    setDialogOpen(true);
  };

  const handleDeleteItem = () => {
    if (dialogItemIndex !== null) {
      const updatedEventDate = [...values.eventDate];
      updatedEventDate.splice(dialogItemIndex, 1);
      setFieldValue('eventDate', updatedEventDate);
    }
    setCreatingItem(false);
    setDialogOpen(false);
    setDialogItemIndex(null);
  };

  const handleCloseDialog = () => {
    if (creatingItem) {
      const updatedEventDate = [...values.eventDate];
      updatedEventDate.splice(dialogItemIndex, 1);
      setFieldValue('eventDate', updatedEventDate);
    }
    setCreatingItem(false);
    setDialogOpen(false);
    setDialogItemIndex(null);
  };

  const handleSubmitForm = () => setCreatingItem(false);

  return (
    <>
      <StyledTableContainer component={Paper} sx={{ maxHeight: options?.maxHeight || 540 }}>
        <Table size="small" aria-label="simple table" stickyHeader sx={{ minWidth: options.minWidth || 540 }}>
          <TableHead sx={{ height: 24 }}>
            <TableRow>
              <TableCell align="left" />
              {columns?.map((column, index) => (
                <TableCell align="center" key={`weekday-${column?.day}-${index}`}>
                  {column?.weekDay}. {column?.day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, rowIndex) => (
              <TableRow key={`timeline-${rowIndex}`}>
                <Tooltip
                  placement="right"
                  title={`${row.days?.reduce((prev, curr) => prev + curr?.data?.length, 0)} event(s) on this week timeline`}
                >
                  <StyledTableCell scope="row" align="center" component="th">
                    <Typography variant="body2">{row?.label}</Typography>
                  </StyledTableCell>
                </Tooltip>
                {row?.days?.map((day, dayIndex) => (
                  <DayModeStyledCell
                    key={day?.id}
                    align="center"
                    onClick={() => handleCellClick(rowIndex, dayIndex)}
                  >
                    {day?.schedule?.map((slot, slotIndex) => (
                      slot === 1 && (
                        <SlotDiv
                          key={`slot-${slotIndex}`}
                          slotIndex={slotIndex}
                          color={
                            day.data[0]?.state
                              ? STATES.find(state => state.value === day.data[0]?.state)?.color
                              : theme.palette.dateStatus.valid
                          }
                          onClick={() => handleCellClick(rowIndex, dayIndex)}
                        />
                      )
                    ))}
                  </DayModeStyledCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <Component.DeleteBlockFabButton size="small" onClick={handleCloseDialog}>
          <DeleteIcon />
        </Component.DeleteBlockFabButton>
        <DialogTitle>{creatingItem ? "Ajouter un evenement" : "Modifier un evenement"}</DialogTitle>
        <DialogContent>
          {dialogItemIndex !== null && (
            <Component.CmtDisplayFields
              values={values}
              setGenerateDate={setGenerateDate}
              setFieldValue={setFieldValue}
              item={values.eventDate[dialogItemIndex]}
              index={dialogItemIndex}
              states={STATES}
              {...restProps}
            />
          )}
        </DialogContent>
        <DialogActions>
          <EventAddSpecialPricing
            values={values}
            setFieldValue={setFieldValue}
            touched={touched}
            errors={errors}
            selectedDate={values.eventDate[dialogItemIndex]}
            {...restProps}
          />
          {!creatingItem && <Button onClick={handleDeleteItem} color="error">Supprimer</Button>}
          <Button onClick={handleSubmitForm} color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DayModeView;
