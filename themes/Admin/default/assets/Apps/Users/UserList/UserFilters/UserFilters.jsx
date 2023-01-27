import React from 'react';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const UserFilters = ({ filters, changeFilters }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <Component.CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status"
                label="Actif ?"
                icon={<CheckIcon />}
                id="activeFilter"
            />

            <Component.CmtSearchFilters
                value={filters.firstName}
                setValue={(newValue) => changeFilters({ ...filters, firstName: newValue })}
                title="Chercher par prénom"
                label="Prénom"
                icon={<PersonIcon />}
                id="firstNameFilter"
            />

            <Component.CmtSearchFilters
                value={filters.lastName}
                setValue={(newValue) => changeFilters({ ...filters, lastName: newValue })}
                title="Chercher par nom"
                label="Nom"
                icon={<PersonIcon />}
                id="lastNameFilter"
            />

            <Component.CmtSearchFilters
                value={filters.email}
                setValue={(newValue) => changeFilters({ ...filters, email: newValue })}
                title="Chercher par email"
                label="Email"
                icon={<EmailIcon />}
                id="emailFilter"
            />

            <Component.CmtSearchFilters
                value={filters.role}
                setValue={(newValue) => changeFilters({ ...filters, role: newValue })}
                title="Chercher par role"
                label="Role"
                icon={<AssignmentIndIcon />}
                id="roleFilter"
            />
        </Box>
    );
};
