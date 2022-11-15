import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";

import { ActiveModuleContext } from "@/AdminService/ActiveModule/ActiveModuleContext";

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";

import { loginFailure } from "@Redux/profile/profileSlice";

export const ActiveModule = () => {
    const dispatch = useDispatch();
    const [modulesActive, setModulesActive] = useState(false);

    useEffect(() => {
        (async () => {
            const check = await Api.authApi.checkIsAuth();

            if (check.result) {
                const result = await Api.modulesApi.getModulesActive();
                if (result.result) {
                    ActiveModuleContext(result.modules);
                }
            } else {
                dispatch(loginFailure({ error: check.error }));
            }

            setModulesActive(true);
        })();
    }, []);

    if (!modulesActive)
        return <></>;

    return <Component.App />;
}