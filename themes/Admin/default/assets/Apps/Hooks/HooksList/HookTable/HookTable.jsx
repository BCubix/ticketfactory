import React from "react";
import { Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Component } from "@/AdminService/Component";

export const HookTable = ({ hookName, modules, setDeleteDialog}) => {
    return (
        <TableContainer>
            <Table sx={{ minWidth: 650, marginTop: 10 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '5%' }}>
                            {hookName}
                        </TableCell>
                        <TableCell sx={{ width: '5%' }}>
                        </TableCell>
                        <TableCell sx={{ width: '10%' }}>
                        </TableCell>
                        <TableCell sx={{ width: '5%' }}>
                        </TableCell>
                        <TableCell sx={{ width: '10%' }}>
                        </TableCell>
                        <TableCell sx={{ width: '55%' }}>
                        </TableCell>
                        <TableCell sx={{ width: '10%' }}>
                        </TableCell>
                    </TableRow>
                </TableHead>

                <Component.HookTableBody
                    hookName={hookName}
                    modules={modules}
                    setDeleteDialog={setDeleteDialog}
                />
            </Table>
        </TableContainer>
    );
};