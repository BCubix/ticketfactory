import {
    Checkbox,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    ListSubheader,
    MenuItem,
    Select
} from "@mui/material";
import React from "react";

export const CmtSelectField = ({ label, required = false, multiple = false, name, id = name?.replaceAll('.', '-'), value, list, getValue, getName, setFieldValue, errors, getMenuItem = null }) => {
    return (
        <FormControl fullWidth sx={{ mt: 4 }}>
            <InputLabel id={`${id}-label`} required={required} size="small">
                {label}
            </InputLabel>
            <Select
                labelId={`${id}-label`}
                size="small"
                variant="standard"
                value={value}
                label={label}
                onChange={(e) => {
                    setFieldValue(name, e.target.value);
                }}
                {...(multiple && {
                    multiple: true,
                    renderValue: (selected) => {
                        let renderName = [];

                        selected.forEach((elem) => {
                            const name = getName(list.find((el) => el.id === elem));
                            if (name) {
                                renderName.push(name);
                            }
                        });

                        return renderName.join(', ');
                    }
                })}
            >
                {null !== getMenuItem ? (
                    getMenuItem((newList) =>
                        newList.map((item, index) => (
                            <MenuItem value={getValue(item)} key={index} id={`${id}-value-${getValue(item)}`}>
                                {multiple && <Checkbox checked={value.indexOf(getValue(item)) > -1} />}
                                <ListItemText>{getName(item)}</ListItemText>
                            </MenuItem>
                        ))
                    )
                ) : (
                    list.map((item, index) => (
                        <MenuItem value={getValue(item)} key={index} id={`${id}-value-${getValue(item)}`}>
                            {multiple && <Checkbox checked={value.indexOf(getValue(item)) > -1} />}
                            <ListItemText>{getName(item)}</ListItemText>
                        </MenuItem>
                    ))
                )}
            </Select>
            {errors && (
                <FormHelperText error id={`${id}-helper-text`}>
                    {errors}
                </FormHelperText>
            )}
        </FormControl>
    );
};