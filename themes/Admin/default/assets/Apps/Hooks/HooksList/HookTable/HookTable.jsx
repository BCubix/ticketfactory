import React from "react";
import { Table, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Component } from "@/AdminService/Component";

export const HookTable = ({ hookName, modules, setDeleteDialog}) => {
    return (
        <TableContainer sx={{ mt: 0 }}>
            <Table sx={{ minWidth: 650, marginTop: 10 }}>
                <TableHead sx={{ width: '100%' }}>
                    <Typography variant="h5" fontSize={15} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        {hookName}
                    </Typography>
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
