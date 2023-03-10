import React from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

export const LightEditor = ({ value, onChange, className, ...rest }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(event, editor) => {
                const data = editor.getData();

                onChange(data);
            }}
            {...rest}
        />
    );
};
