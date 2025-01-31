import React, { useState, useEffect } from 'react';
import { Chip, Typography, Grid, CardContent, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ordersSelector, getLatestOrdersAction, changeOrdersFilters } from '@Apps/Orders/redux/orders/ordersSlice';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

export const listCrud = {
    filtersData: [],
    filterList: [],
    pagination: false,
    tableList: [
        { name: 'reference', label: 'Référence', width: '20%', sortable: false },
        {
            name: 'name',
            label: 'Client',
            width: '25%',
            renderFunction: (item) => (
                <Typography>
                    {item.customer?.civility} {item.customer?.firstName} {item.customer?.lastName}
                </Typography>
            ),
        },
        {
            name: 'total',
            label: 'Total',
            width: '10%',
            renderFunction: (item) => (
                <Chip
                    sx={{ backgroundColor: '#FFFFFF', color: (theme) => theme.palette.success.main }}
                    label={`${item?.cart?.eventRows?.reduce((partialSum, a) => partialSum + a.total, 0)?.toFixed(2)} €`}
                />
            ),
        },
        {
            name: 'status',
            label: 'État',
            width: '10%',
            renderFunction: (item) => <Chip sx={{ backgroundColor: item.status.color }} label={item.status.name} />,
        },
    ],
    loadDataAction: () => getLatestOrdersAction(),
    changeFiltersActions: (props, page) => changeOrdersFilters(props, page),
    dataSelector: ordersSelector,
    dataList: (selector) => selector.latestOrders,
    links: {
        detail: (id) => `${Constant.ORDERS_BASE_PATH}/${id}`,
        preview: (item) => `${Constant.ORDERS_BASE_PATH}/${item.id}`,
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const LatestOrderList = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const objectData = useSelector(listCrud.dataSelector);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!objectData?.loading && !objectData?.latestOrders && !objectData?.error) {
            dispatch(listCrud?.loadDataAction());
        }
        setLoading(objectData?.loading);
    }, [objectData?.loading, objectData?.latestOrders]);

    useEffect(() => {
        setLoading(objectData?.loading);
    }, [objectData?.loading]);

    const handleRowClick = (id) => {
        navigate(listCrud.links.detail(id));
    };

    return (
        <Component.CmtCard>
            <Component.CmtCardHeader title="Dernières commandes" />
            <Grid container spacing={4}>
                <CardContent>
                <TableContainer >
                <Table>
                        <TableHead>
                            <TableRow>
                                {listCrud.tableList.map((column) => (
                                    <TableCell
                                        key={column.name}
                                        sx={{ padding: '4x 8px', width: column.width}}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {objectData?.latestOrders?.map((row, index) => (
                                <TableRow
                                    key={index}
                                    onClick={() => handleRowClick(row.id)}
                                    sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {listCrud.tableList.map((column) => (
                                        <TableCell
                                            key={column.name}
                                            sx={{ padding: '11px 8px', width: column.width, borderBottom: 'none' }}
                                        >
                                            {column.renderFunction ? column.renderFunction(row) : row[column.name]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </CardContent>
            </Grid>
        </Component.CmtCard>
    );
};
