import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format, add, sub, getDaysInMonth } from 'date-fns';
import {
  Typography,
  Toolbar,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Stack,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SchedulerToolbar = ({
  today = new Date(),
  switchMode = 'month',
  toolbarProps = {},
  onModeChange,
  onDateChange,
  translations = {},
}) => {
  const theme = useTheme();
  const { showDatePicker, showSwitchModeButtons } = toolbarProps;

  const [mode, setMode] = useState(switchMode);
  const [selectedDate, setSelectedDate] = useState(today);

  const daysInMonth = useMemo(() => getDaysInMonth(selectedDate), [selectedDate]);
  const isDayMode = mode === 'day';
  const isWeekMode = mode === 'week';
  const isMonthMode = mode === 'month';

  const labels = { month: 'Month', week: 'Week', day: 'Day', ...translations };

  const handleChangeDate = useCallback((method) => {
    if (!method) return;
    const adjustment = isDayMode ? { days: 1 } : isWeekMode ? { weeks: 1 } : { months: 1 };
    setSelectedDate(method(selectedDate, adjustment));
  }, [isDayMode, isWeekMode, selectedDate]);

  const formattedDate = useMemo(() => {
    const englishMonth = format(selectedDate, 'MMMM');
    const translatedMonth = translations[englishMonth] || englishMonth;
  
    if (isMonthMode) {
      return `${translatedMonth}-${selectedDate.getFullYear()}`;
    }
    const day = format(selectedDate, 'd');
    return `${day} ${translatedMonth} ${selectedDate.getFullYear()}`;
  }, [selectedDate, isMonthMode, translations]);

  useEffect(() => {
    if (mode !== switchMode) setMode(switchMode);
  }, [switchMode]);

  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  useEffect(() => {
    onDateChange?.(daysInMonth, selectedDate);
  }, [daysInMonth, selectedDate, onDateChange]);

  return (
    <Toolbar
      variant="dense"
      sx={{
        px: '0px !important',
        display: 'block',
        borderBottom: `1px ${theme.palette.divider} solid`,
      }}
    >
      <Grid container spacing={0} alignItems="center" justifyContent="space-between">
        {/* Date Picker Section */}
        {showDatePicker && (
          <Grid item xs="auto">
            <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => handleChangeDate(sub)} size="medium" color="inherit" aria-label="Previous period">
                <ChevronLeftIcon />
              </IconButton>
              <Button>
                  {formattedDate}
              </Button>
              <IconButton onClick={() => handleChangeDate(add)} size="medium" color="inherit" aria-label="Next period">
                <ChevronRightIcon />
              </IconButton>
            </Typography>
          </Grid>
        )}

        {/* Mode Toggle Section */}
        {showSwitchModeButtons && (
          <Grid item xs="auto">
            <Stack direction="row" alignItems="center" spacing={1}>
              <ToggleButtonGroup
                exclusive
                value={mode}
                size="small"
                color="primary"
                onChange={(e, newMode) => newMode && setMode(newMode)}
              >
                {['month', 'week', 'day'].map((value) => (
                  <ToggleButton key={value} value={value}>
                    {labels[value]}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Toolbar>
  );
};

export default SchedulerToolbar;
