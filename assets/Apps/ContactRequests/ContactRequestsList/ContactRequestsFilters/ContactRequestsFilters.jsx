import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SubjectIcon from '@mui/icons-material/Subject';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

export const ContactRequestsFilters = ({ filters, changeFilters }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <Component.CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status de gestion"
                label="Gérée ?"
                icon={<CheckIcon />}
            />

            <Component.CmtSearchFilters
                value={filters.firstName}
                setValue={(newValue) => changeFilters({ ...filters, firstName: newValue })}
                title="Chercher par prénom"
                label="Prénom"
                icon={<PersonIcon />}
            />

            <Component.CmtSearchFilters
                value={filters.lastName}
                setValue={(newValue) => changeFilters({ ...filters, lastName: newValue })}
                title="Chercher par nom"
                label="Nom"
                icon={<PersonIcon />}
            />

            <Component.CmtSearchFilters
                value={filters.email}
                setValue={(newValue) => changeFilters({ ...filters, email: newValue })}
                title="Chercher par email"
                label="Email"
                icon={<EmailIcon />}
            />

            <Component.CmtSearchFilters
                value={filters.phone}
                setValue={(newValue) => changeFilters({ ...filters, phone: newValue })}
                title="Chercher par téléphone"
                label="Téléphone"
                icon={<PhoneIcon />}
            />

            <Component.CmtSearchFilters
                value={filters.subject}
                setValue={(newValue) => changeFilters({ ...filters, subject: newValue })}
                title="Chercher par objet"
                label="Objet"
                icon={<SubjectIcon />}
            />
        </Box>
    );
};
