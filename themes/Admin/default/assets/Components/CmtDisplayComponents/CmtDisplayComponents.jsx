import React from 'react';

export const CmtDisplayComponents = ({ list, ...inheritedProps }) => {
    return (
        <>
            {list?.map((elem, index) => {
                const { component: Component, keyId, ...props } = elem;

                if (!Component) {
                    return <React.Fragment key={index} />;
                }
                return <Component key={index} {...inheritedProps} {...props} />;
            })}
        </>
    );
};