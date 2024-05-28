import { Checkbox, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import React from 'react';

export const CmtSelectField = ({
    label,
    required = false,
    multiple = false,
    name,
    id = name?.replaceAll('.', '-'),
    value,
    list,
    getValue,
    getName,
    setFieldValue,
    errors,
    handleBlur = null,
    getMenuItem = null,
    disabled = false,
    emptyLabel = '',
    displayEmpty = true,
}) => {
    return (
        <FormControl
            variant="standard"
            fullWidth
            sx={{ mt: 4 }}
            size="small"
            required={required}
            className={`Mui-Select-FormControl ${!Boolean(required) && !Boolean(multiple) && Boolean(displayEmpty) ? 'displayEmpty' : ''}`}
        >
            <InputLabel id={`${id}-label`} required={required} size="small">
                {label}
            </InputLabel>
            <Select
                labelId={`${id}-label`}
                size="small"
                variant="standard"
                value={value}
                label={label}
                name={name}
                disabled={disabled}
                onChange={(e) => {
                    setFieldValue(name, e.target.value);
                }}
                onBlur={handleBlur}
                {...(multiple && {
                    multiple: true,
                    renderValue: (selected) => {
                        let renderName = [];

                        selected?.forEach((elem) => {
                            const name = getName(list?.find((el) => getValue(el) === elem));

                            if (name) {
                                renderName.push(name);
                            }
                        });

                        return renderName.join(', ');
                    },
                })}
                displayEmpty={!Boolean(required) && !Boolean(multiple) && Boolean(displayEmpty)}
            >
                {!Boolean(required) && !Boolean(multiple) && Boolean(displayEmpty) && (
                    <MenuItem value={''}>
                        <ListItemText>{emptyLabel || `Pas de ${label.charAt(0).toLowerCase() + label.slice(1)} `}</ListItemText>
                    </MenuItem>
                )}

                {null !== getMenuItem
                    ? getMenuItem((newList) =>
                          newList.map((item, index) => (
                              <MenuItem value={getValue(item)} key={index} id={`${id}-value-${getValue(item)}`}>
                                  {multiple && <Checkbox checked={value.indexOf(getValue(item)) > -1} />}
                                  <ListItemText>{getName(item)}</ListItemText>
                              </MenuItem>
                          ))
                      )
                    : list?.map((item, index) => (
                          <MenuItem value={getValue(item)} key={index} id={`${id}-value-${getValue(item)}`}>
                              {multiple && <Checkbox checked={value.indexOf(getValue(item)) > -1} />}
                              <ListItemText>{getName(item)}</ListItemText>
                          </MenuItem>
                      ))}
            </Select>
            {errors && (
                <FormHelperText error id={`${id}-helper-text`}>
                    {errors}
                </FormHelperText>
            )}
        </FormControl>
    );
};
