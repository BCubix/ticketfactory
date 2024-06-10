import React, { useMemo } from 'react';
import { Component } from '@/AdminService/Component';
import { useSelector } from 'react-redux';
import { parametersSelector } from '@Apps/Parameters/redux/parameters/parametersSlice';
import { Crud } from '@/AdminService/Crud';

export const UrlParameters = ({ listCrud = Crud.url.list }) => {
    const { parameters } = useSelector(parametersSelector);

    const getParameters = useMemo(() => {
        return parameters.filter((item) => listCrud.parameterList?.includes(item?.paramKey));
    }, [parameters]);

    return <Component.ParametersMenu parameterList={getParameters} generalParameter={false} />;
};
