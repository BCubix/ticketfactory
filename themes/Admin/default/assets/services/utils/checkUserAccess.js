export const checkUserAccess = (userRoles, authorizedRoles) => {
    if (Array.isArray(authorizedRoles)) {
        return authorizedRoles?.find((authorizedRole) => userRoles?.includes(authorizedRole)) !== null;
    }

    return userRoles?.includes(authorizedRoles);
};
