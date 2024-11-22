import React from 'react';
import { Component } from '@/AdminService/Component';
import { FormHelperText, InputLabel } from '@mui/material';

const LABEL = 'Editeur de contenus';
const TYPE = 'wysiwyg';
const TYPE_GROUP_NAME = 'Contenu';

const FormComponent = ({ value, errors, touched, name, label, setFieldTouched, setFieldValue }) => (
    <>
        <Component.LightEditorFormControl className="pageBlockEditor" id={`${name.replaceAll('.', '-')}Control`}>
            <Component.LightEditor
                labelId={`${label}-label`}
                value={value}
                onBlur={() => setFieldTouched(name, true, false)}
                onChange={(val) => {
                    setFieldValue(name, val);
                }}
            />
            {touched && errors && <FormHelperText error>{errors}</FormHelperText>}
        </Component.LightEditorFormControl>
    </>
);

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
};
