<?php

namespace App\Manager;

use App\Entity\User\Role;

class RoleManager extends AbstractManager
{
    public const SERVICE_NAME = 'role';

    public function getRoles(array $filters): ?array
    {
        $roles = $this->em->getRepository(Role::class)->findAllForAdmin($filters);
        $groupedRoles = [];

        foreach ($roles['results'] as $role) {
            $groupedRoles[$role->getGroupName()][] = $role;
        }

        return $groupedRoles;
    }
}