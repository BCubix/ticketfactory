import React from 'react';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';

export const MapContentField = ({ value, onChange, label, onBlur, name, error }) => {
    return (
        <>
            <CmtTextField
                value={value.token}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={`${name}.token`}
                error={error}
            />
        </>
    );
};
