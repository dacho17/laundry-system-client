export enum UserRole {
    TENANT = 1,
    RESIDENCE_ADMIN = 2,
    SYSTEM_ADMIN = 3
}

export function getUserRole(userRole: string | number): UserRole {
    if (typeof userRole == 'string') {
        const userRoleNum = parseInt(userRole);
        if (!isNaN(userRoleNum)) {
            userRole = userRoleNum;
        }
    }


    if (typeof userRole == 'string') {
        switch(userRole) {
            case UserRole[UserRole.RESIDENCE_ADMIN]:
                return UserRole.RESIDENCE_ADMIN;
            case UserRole[UserRole.TENANT]:
                return UserRole.TENANT;
            case UserRole[UserRole.SYSTEM_ADMIN]:
                return UserRole.SYSTEM_ADMIN;
            default:
                throw Error(`UserRole provided ${userRole} did not match any defined roles`);
        }
    }

    else if (typeof userRole == 'number') {
        switch(userRole) {
            case UserRole.RESIDENCE_ADMIN:
                return UserRole.RESIDENCE_ADMIN;
            case UserRole.TENANT:
                return UserRole.TENANT;
            case UserRole.SYSTEM_ADMIN:
                return UserRole.SYSTEM_ADMIN;
            default:
                throw Error(`UserRole provided ${userRole} did not match any defined roles`);
        }
    }

    else throw Error('Unrecognized type');
}
