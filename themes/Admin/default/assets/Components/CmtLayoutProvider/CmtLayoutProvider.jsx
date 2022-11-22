import React, { useState } from 'react';

const INIT_SIDEBAR_VALUE = {
    isOpen: true,
    mobileCheck: false,
};

export const LayoutContext = React.createContext({
    sideBar: INIT_SIDEBAR_VALUE,
    changeSideBarValue: () => {},
});

export const CmtLayoutProvider = ({ children }) => {
    const [sideBarValues, setSideBarValues] = useState(INIT_SIDEBAR_VALUE);

    return (
        <LayoutContext.Provider
            value={{
                sideBar: sideBarValues,
                changeSideBarValue: (values) => setSideBarValues({ ...values }),
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
};
