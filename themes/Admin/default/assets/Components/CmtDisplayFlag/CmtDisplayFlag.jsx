import React from 'react';
import ReactCountryFlag from 'react-country-flag';

export const CmtDisplayFlag = ({ item }) => {
    return <ReactCountryFlag countryCode={item?.lang?.isoCode} style={{ fontSize: '1.5rem' }} />;
};
