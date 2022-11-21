import { Box } from '@mui/system';
import React from 'react';
import { CmtSearchFilters } from '../../../../Components/CmtFilters/CmtSearchFilters';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SubjectIcon from '@mui/icons-material/Subject';
import CheckIcon from '@mui/icons-material/Check';
import { CmtBooleanFilters } from '../../../../Components/CmtFilters/CmtBooleanFilters';

export const ContactRequestsFilters = ({ filters, changeFilters }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status de gestion"
                label="Gérée ?"
                icon={<CheckIcon />}
                id="activeFilter"
            />

            <CmtSearchFilters
                value={filters.firstName}
                setValue={(newValue) => changeFilters({ ...filters, firstName: newValue })}
                title="Chercher par prénom"
                label="Prénom"
                icon={<PersonIcon />}
                id="firstNameFilter"
            />

            <CmtSearchFilters
                value={filters.lastName}
                setValue={(newValue) => changeFilters({ ...filters, lastName: newValue })}
                title="Chercher par nom"
                label="Nom"
                icon={<PersonIcon />}
                id="lastNameFilter"
            />

            <CmtSearchFilters
                value={filters.email}
                setValue={(newValue) => changeFilters({ ...filters, email: newValue })}
                title="Chercher par email"
                label="Email"
                icon={<EmailIcon />}
                id="emailFilter"
            />

            <CmtSearchFilters
                value={filters.phone}
                setValue={(newValue) => changeFilters({ ...filters, phone: newValue })}
                title="Chercher par téléphone"
                label="Téléphone"
                icon={<PhoneIcon />}
                id="phoneFilter"
            />

            <CmtSearchFilters
                value={filters.subject}
                setValue={(newValue) => changeFilters({ ...filters, subject: newValue })}
                title="Chercher par objet"
                label="Objet"
                icon={<SubjectIcon />}
                id="subjectFilter"
            />
        </Box>
    );
};
