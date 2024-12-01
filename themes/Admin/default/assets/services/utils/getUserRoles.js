export const getUserRoles = (user) => {
    if (!user || !user.profiles) {
        return [];
    }

    return (
        user?.profiles
            ?.map((profile) => {
                if (!profile.active) {
                    return [];
                }

                return profile?.roles?.map((role) => role.name) || [];
            })
            .reduce((arr, roles) => arr.concat(roles), []) || []
    );
};
