import React from "react";
import { FormHelperText, InputLabel } from "@mui/material";
import { Component } from "@/AdminService/Component";

export const CmtEditorField = ({ label, required = false, name, id = name?.replaceAll('.', '-'), value, setFieldValue, setFieldTouched, errors }) => {
    return (
        <>
            <InputLabel id={`${id}-label`} required={required} sx={{ fontSize: '12px' }}>
                {label}
            </InputLabel>
            <Component.LightEditorFormControl id={`${id}-control`}>
                <Component.LightEditor
                    labelId={`${id}-label`}
                    value={value}
                    onBlur={() => setFieldTouched(name, true, false)}
                    onChange={(val) => {
                        setFieldValue(name, val);
                    }}
                />
                {errors && (
                    <FormHelperText error id={`${id}-helper-text`}>
                        {errors}
                    </FormHelperText>
                )}
            </Component.LightEditorFormControl>
        </>
    );
};