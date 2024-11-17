export const getUserRoles = (user) => {
    if (!user || !user.profiles) {
        return [];
    }

    return user?.profiles?.map((profile) => profile?.roles?.map((role) => role.name) || []).reduce((arr, roles) => arr.concat(roles), []) || [];
};
